import fs from 'node:fs';
import type { Resolver } from '@nuxt/kit';
import { createResolver } from '@nuxt/kit';
import type {
  ModuleDefineThemeBlockStyles,
  ModuleObject,
  ModuleOptionsExtend,
  ModuleServer
} from '../../types';
import uPath from '../../helpers/server/uPath';
import tsMorphProject from '../../helpers/server/tsMorphProject';
import writeThemeStructure from '../../helpers/server/writeThemeStructure';
import defineChecker from '../../helpers/defineChecker';

export class MetaFiles {
  private readonly metaResolver: Resolver;
  private readonly config: ModuleOptionsExtend;
  private readonly configDefaultTheme: string;

  constructor(private readonly ctx: ModuleServer) {
    this.config = this.ctx.getConfig();
    this.configDefaultTheme = this.config.themesConfig.system.default;
    this.metaResolver = createResolver(this.ctx.getResolver().resolve('runtime', 'meta'));
  }

  private _remove(): void {
    const metaDir = this.metaResolver.resolve();
    if (fs.existsSync(metaDir)) fs.rmSync(metaDir, { recursive: true });
  }

  private _mkDir(): void {
    const metaDir = this.metaResolver.resolve();
    if (!fs.existsSync(metaDir)) fs.mkdirSync(metaDir);
  }

  private _createConnector(): void {
    const filePath = this.metaResolver.resolve('connector.js');
    const themesConnector = this.ctx
      .getThemesPaths()
      .map((themePath) => {
        const themeByRootPath = uPath.parse(themePath).dir.slice(this.ctx.getRootResolver().resolve().length);
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

  private _createThemesStructure(): void {
    const filePath = this.metaResolver.resolve('themesStructure.ts');
    const metaFile = tsMorphProject.createSourceFile(filePath, '', { overwrite: true });
    const defaultTheme = this.ctx.getThemes()[this.configDefaultTheme];

    if (defaultTheme) {
      metaFile.addTypeAlias({
        name: 'ModuleMetaBlocks',
        isExported: true,
        type: writer => writeThemeStructure(writer, defaultTheme, 'type')
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

  private _createThemesStyles(): void {
    const mergedStyles: ModuleObject = {};

    const generateMergedStyles = (styles: ModuleDefineThemeBlockStyles[]) => {
      styles.forEach((block) => {
        if (defineChecker(block)) {
          generateMergedStyles(block.styles as ModuleDefineThemeBlockStyles[]);
        } else {
          for (const key of Object.keys(block)) {
            mergedStyles[key] = (block as any)[key];
          }
        }
      });
    };

    const filePath = this.metaResolver.resolve('themesStyles.css');
    const metaFile = tsMorphProject.createSourceFile(filePath, '', { overwrite: true });
    const defaultTheme = this.ctx.getThemes()[this.configDefaultTheme];

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

  update(): void {
    this._createThemesStructure();
    this._createThemesStyles();
  }

  create(): void {
    this._mkDir();
    this._createConnector();
    this._createThemesStructure();
    this._createThemesStyles();
  }
}
