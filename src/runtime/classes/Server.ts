import path from 'node:path';
import fs from 'node:fs';
import type { Nuxt } from '@nuxt/schema';
import { createResolver, type Resolver } from '@nuxt/kit';
import type { CodeBlockWriter } from 'ts-morph';
import defineThemeBlock from '../composables/defineThemeBlock';
import defineThemeBlockRoot from '../composables/defineThemeBlockRoot';
import type {
  ModuleDefineThemeBlockRootReturn, ModuleDefineThemeBlockSetting, ModuleObject,
  ModuleOptions,
  ModuleOptionsExtend, ModuleServerThemes
} from '../types';
import globSync, { globSep } from '../helpers/globSync';
import { loadTsModule } from '../helpers/loadTsModule';
import logger from '../helpers/logger';
import tsMorphProject from '../helpers/tsMorphProject';
import defineChecker from '../helpers/defineChecker';

export class Server {
  private readonly config: ModuleOptionsExtend;
  private readonly rootDir: string;
  private readonly rootThemesDir: string;
  private readonly metaResolver: Resolver;

  private readonly themes: ModuleServerThemes = {};
  private readonly themesPaths: string[] = [];

  constructor(
    private readonly nuxt: Nuxt,
    private readonly resolver: Resolver
  ) {
    this.metaResolver = createResolver(this.resolver.resolve('runtime', 'meta'));
    this.config = this._initConfig(this.nuxt.options.runtimeConfig.public.themesEditor as ModuleOptions);
    this.rootDir = this.nuxt.options.rootDir;
    this.rootThemesDir = globSep(path.join(this.rootDir, this.config.themesDir));
  }

  private _initConfig(options: ModuleOptions): ModuleOptionsExtend {
    return {
      ...options,
      themes: [],
      keys: {
        state: 'nuxt-themes-editor:state',
        storage: 'nuxt-themes-editor:selected-theme',
        style: 'nuxt-themes-editor:style'
      }
    };
  }

  async readThemes() {
    this.themesPaths.splice(0);
    const indexThemesPaths = globSync(path.join(this.rootThemesDir, '*', 'index.ts'));

    (global as any).defineThemeBlock = defineThemeBlock;
    (global as any).defineThemeBlockRoot = defineThemeBlockRoot;

    for (const themePath of indexThemesPaths) {
      if (!fs.existsSync(themePath)) {
        logger.warn(`Theme file wasn't found: '${themePath}'.`);
        continue;
      }

      const themeName = themePath.slice(this.rootThemesDir.length + 1, themePath.lastIndexOf('/'));
      const themeFile = (await loadTsModule(themePath))?.default as ModuleDefineThemeBlockRootReturn;

      if (!themeFile) {
        logger.warn(`Error loading theme file: '${themePath}'.`);
        continue;
      } else if (themeFile.type !== 'defineThemeBlockRoot') {
        logger.warn(`Unknown define theme type: '${themePath}'. Use defineThemeEditorRoot as export default.`);
        continue;
      }

      this.themesPaths.push(themePath);
      this.config.themes.push(themeName);
      this.themes[themeName] = themeFile;
    }
  }

  getConfig() {
    return this.config;
  }

  // Meta Generator

  private _metaRemove() {
    const metaDir = this.metaResolver.resolve();
    if (fs.existsSync(metaDir)) fs.rmSync(metaDir, { recursive: true });
  }

  private _metaMkDir() {
    const metaDir = this.metaResolver.resolve();
    if (!fs.existsSync(metaDir)) fs.mkdirSync(metaDir);
  }

  private _metaCreateConnector() {
    const filePath = this.metaResolver.resolve('connector.js');
    const themesConnector = Object
      .values(this.themesPaths)
      .flat()
      .map((themePath) => {
        const themeByRootPath = path.parse(themePath).dir.slice(this.rootDir.length);
        const themeName = themeByRootPath.split('/').at(-1)!;

        return {
          imp: `import THEME_${themeName} from '@${themeByRootPath}';`,
          exp: `THEME_${themeName}`
        };
      });

    const themesImps = themesConnector.map(theme => theme.imp).join('\n');
    const themesExps = themesConnector.map(theme => theme.exp).join(',\n  ');

    const fileContent = `${themesImps}${themesImps.length ? '\n\n' : ''}export default {${themesExps.length ? `\n  ${themesExps}\n` : ''}};\n`;

    fs.writeFileSync(filePath, fileContent, 'utf-8');
  }

  private _metaCreateThemesStructure() {
    const generateBlockCode = (writer: CodeBlockWriter, styles: ModuleDefineThemeBlockSetting[]) => {
      styles.forEach((block) => {
        if (defineChecker(block)) {
          writer.write(`'${block.id}': `);

          if (block.styles.length > 1) writer.inlineBlock(() => generateBlockCode(writer, block.styles as ModuleDefineThemeBlockSetting[]));
          else writer.write('{}');

          writer.write(';\n');
        }
      });
    };

    const filePath = this.metaResolver.resolve('themesStructure.ts');
    const metaFile = tsMorphProject.createSourceFile(filePath, '', { overwrite: true });
    const defaultTheme = this.themes[this.config.defaultTheme];

    if (defaultTheme) {
      metaFile.addTypeAlias({
        name: 'ModuleMetaBlocks',
        isExported: true,
        type: writer => writer.block(() => generateBlockCode(writer, defaultTheme.styles))
      });
    } else {
      metaFile.addTypeAlias({
        name: 'ModuleMetaBlocks',
        isExported: true,
        type: writer => writer.write('object')
      });
    }

    metaFile.saveSync();
  }

  private _metaCreateThemesStyles() {
    const mergedStyles: ModuleObject = {};

    const generateMergedStyles = (styles: ModuleDefineThemeBlockSetting[]) => {
      styles.forEach((block) => {
        if (defineChecker(block)) {
          generateMergedStyles(block.styles as ModuleDefineThemeBlockSetting[]);
        } else {
          for (const key of Object.keys(block)) {
            mergedStyles[key] = (block as any)[key];
          }
        }
      });
    };

    const filePath = this.metaResolver.resolve('themesStyles.css');
    const metaFile = tsMorphProject.createSourceFile(filePath, '', { overwrite: true });
    const defaultTheme = this.themes[this.config.defaultTheme];

    if (defaultTheme) {
      generateMergedStyles(defaultTheme.styles);
      metaFile.insertText(0, (writer) => {
        writer.writeLine('/* This file does not reflect the actual colors of the variables, it is needed for IDE hints */\n');
        writer.write(`[all-${Date.now()}] `);
        writer.inlineBlock(() => Object.entries(mergedStyles).forEach(([key, value]) => writer.write(`--${key}: ${value};\n`)));
      });
    } else {
      metaFile.insertText(0, (writer) => {
        writer.write(`[all-${Date.now()}] {}`);
      });
    }

    metaFile.saveSync();
  }

  createMeta() {
    this._metaRemove();
    this._metaMkDir();
    this._metaCreateConnector();
    this._metaCreateThemesStructure();
    this._metaCreateThemesStyles();
  }
}
