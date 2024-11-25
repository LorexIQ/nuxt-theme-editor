import fs from 'node:fs';
import type { CodeBlockWriter } from 'ts-morph';
import type { Resolver } from '@nuxt/kit';
import { createResolver } from '@nuxt/kit';
import uPath from '../helpers/uPath';
import type { ModuleDefineThemeBlockSetting, ModuleObject, ModuleOptionsExtend } from '../types';
import defineChecker from '../helpers/defineChecker';
import tsMorphProject from '../helpers/tsMorphProject';
import type { Server } from './Server';

export class MetaFiles {
  private readonly metaResolver: Resolver;
  private readonly config: ModuleOptionsExtend;

  constructor(private readonly ctx: Server) {
    this.metaResolver = createResolver(this.ctx.getResolver().resolve('runtime', 'meta'));
    this.config = this.ctx.getConfig();
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
        const themeByRootPath = uPath.parse(themePath).dir.slice(this.ctx.getRootDir().length);
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
    const defaultTheme = this.ctx.getThemes()[this.config.defaultTheme];

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

  private _createThemesStyles(): void {
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
    const defaultTheme = this.ctx.getThemes()[this.config.defaultTheme];

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

  create(): void {
    this._remove();
    this._mkDir();
    this._createConnector();
    this._createThemesStructure();
    this._createThemesStyles();
  }
}
