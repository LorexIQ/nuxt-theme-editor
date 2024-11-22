import fs from 'node:fs';
import type { Nuxt } from '@nuxt/schema';
import { createResolver, type Resolver } from '@nuxt/kit';
import type { CodeBlockWriter } from 'ts-morph';
import defineThemeBlock from '../composables/defineThemeBlock';
import defineThemeBlockRoot from '../composables/defineThemeBlockRoot';
import type {
  ModuleDefineThemeBlockRootReturn, ModuleDefineThemeBlockSetting, ModuleObject,
  ModuleOptions,
  ModuleOptionsExtend, ModuleOptionsExtendMeta, ModuleServerThemes
} from '../types';
import uPath from '../helpers/uPath';
import logger from '../helpers/logger';
import tsMorphProject from '../helpers/tsMorphProject';
import defineChecker from '../helpers/defineChecker';
import { loadTsModule } from '../helpers/loadTsModule';

(global as any).defineThemeBlock = defineThemeBlock;
(global as any).defineThemeBlockRoot = defineThemeBlockRoot;

export class Server {
  private readonly config: ModuleOptionsExtend;
  private readonly rootDir: string;
  private readonly rootThemesDir: string;
  private readonly metaResolver: Resolver;

  private readonly themes: ModuleServerThemes = {};
  private readonly themesPaths: Set<string> = new Set();
  private readonly themesNames: Set<string> = new Set();

  constructor(
    private readonly nuxt: Nuxt,
    private readonly meta: ModuleOptionsExtendMeta,
    private readonly resolver: Resolver
  ) {
    this.metaResolver = createResolver(this.resolver.resolve('runtime', 'meta'));
    this.config = this._initConfig(this.nuxt.options.runtimeConfig.public.themesEditor as any);
    this.rootDir = this.nuxt.options.rootDir;
    this.rootThemesDir = uPath.join(this.rootDir, this.config.themesDir);

    this._initThemesDir();
  }

  private _initConfig(options: ModuleOptions): ModuleOptionsExtend {
    return {
      ...options,
      themes: [],
      keys: {
        state: 'nuxt-themes-editor:state',
        storage: 'nuxt-themes-editor:selected-theme',
        style: 'nuxt-themes-editor:style'
      },
      meta: this.meta
    };
  }

  private _initThemesDir(): void {
    if (!fs.existsSync(this.rootThemesDir)) {
      fs.mkdirSync(this.rootThemesDir, { recursive: true });
    }
  }

  private async _readThemeByPath(indexPath: string): Promise<boolean> {
    if (!fs.existsSync(indexPath)) {
      logger.warn(`Theme file wasn't found: '${indexPath}'.`);
      return false;
    }

    const themeName = indexPath.slice(this.rootThemesDir.length + 1, indexPath.lastIndexOf('/'));
    let themeFile: ModuleDefineThemeBlockRootReturn;

    try {
      themeFile = (await loadTsModule(indexPath))?.default;
    } catch {
      return false;
    }

    if (!themeFile) {
      logger.warn(`Error loading theme file: '${indexPath}'.`);
      return false;
    } else if (themeFile.type !== 'defineThemeBlockRoot') {
      logger.warn(`Unknown define theme type: '${indexPath}'. Use defineThemeEditorRoot as export default.`);
      return false;
    }

    this.themesPaths.add(indexPath);
    this.themesNames.add(themeName);
    this.themes[themeName] = themeFile;
    return true;
  }

  async checkAndGenerateDefaultTheme(): Promise<void> {
    const defaultThemeDir = uPath.join(this.rootThemesDir, this.config.defaultTheme);
    const defaultThemePath = uPath.join(defaultThemeDir, 'index.ts');

    if (!await this._readThemeByPath(defaultThemePath)) {
      logger.info('Default theme generation...');

      if (!fs.existsSync(defaultThemeDir)) {
        fs.mkdirSync(defaultThemeDir);
      }

      const themeIndexFile = tsMorphProject.createSourceFile(defaultThemePath, '', { overwrite: true });
      themeIndexFile.addExportAssignment({
        isExportEquals: false,
        expression: 'defineThemeBlockRoot({})'
      });
      themeIndexFile.saveSync();
    }
  }

  async readThemes(): Promise<void> {
    this.themesPaths.clear();
    const indexThemesPaths = uPath.glob(uPath.join(this.rootThemesDir, '*', 'index.ts'));

    for (const themePath of indexThemesPaths) {
      await this._readThemeByPath(themePath);
    }
  }

  getConfig(): ModuleOptionsExtend {
    return {
      ...this.config,
      themes: [...this.themesNames]
    };
  }

  // Meta Generator

  private _metaRemove(): void {
    const metaDir = this.metaResolver.resolve();
    if (fs.existsSync(metaDir)) fs.rmSync(metaDir, { recursive: true });
  }

  private _metaMkDir(): void {
    const metaDir = this.metaResolver.resolve();
    if (!fs.existsSync(metaDir)) fs.mkdirSync(metaDir);
  }

  private _metaCreateConnector(): void {
    const filePath = this.metaResolver.resolve('connector.js');
    const themesConnector = Array
      .from(this.themesPaths)
      .map((themePath) => {
        const themeByRootPath = uPath.parse(themePath).dir.slice(this.rootDir.length);
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

  private _metaCreateThemesStructure(): void {
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

  private _metaCreateThemesStyles(): void {
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

  createMeta(): void {
    this._metaRemove();
    this._metaMkDir();
    this._metaCreateConnector();
    this._metaCreateThemesStructure();
    this._metaCreateThemesStyles();
  }
}
