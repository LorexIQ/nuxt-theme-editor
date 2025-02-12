import fs from 'node:fs';
import type { Resolver } from '@nuxt/kit';
import { createResolver } from '@nuxt/kit';
import type {
  ModuleOptionsExtend,
  ModuleServer
} from '../../types';
import tsMorphProject from '../../helpers/server/tsMorphProject';
import logger from '../../helpers/server/logger';
import writeThemeStructure from '../../helpers/server/writeThemeStructure';

export class ThemesFiles {
  private readonly themesResolver: Resolver;
  private readonly config: ModuleOptionsExtend;
  private readonly configDefaultTheme: string;

  constructor(private readonly ctx: ModuleServer) {
    this.config = this.ctx.getConfig();
    this.configDefaultTheme = this.config.themesConfig.system.default;
    this.themesResolver = createResolver(this.ctx.getRootResolver().resolve(this.config.themesDir));
  }

  private _checkAndCreateThemesDir(): void {
    const themesDir = this.themesResolver.resolve();
    if (!fs.existsSync(themesDir)) {
      fs.mkdirSync(themesDir, { recursive: true });
    }
  }

  private _checkAndCreateDefaultThemeDir(): void {
    const defaultThemeDir = this.themesResolver.resolve(this.configDefaultTheme);

    if (!fs.existsSync(defaultThemeDir)) {
      fs.mkdirSync(defaultThemeDir);
    }
  }

  private _checkAndGenerateDefaultTheme(): void {
    const defaultThemePath = this.themesResolver.resolve(this.configDefaultTheme, 'index.ts');

    if (!fs.existsSync(defaultThemePath)) {
      logger.info('Default theme generation...');

      const themeIndexFile = tsMorphProject.createSourceFile(defaultThemePath, '', { overwrite: true });

      themeIndexFile.addExportAssignment({
        isExportEquals: false,
        expression: 'defineThemeBlockRoot({}, [])'
      });
      themeIndexFile.saveSync();
    }
  }

  private _checkAndGenerateThemesCommentsFile(): void {
    const commentsFilePath = this.themesResolver.resolve('comments.ts');

    if (!fs.existsSync(commentsFilePath)) {
      logger.info('Comments file generation...');

      const commentsFile = tsMorphProject.createSourceFile(commentsFilePath, '', { overwrite: true });
      const defaultTheme = this.ctx.getThemes()[this.configDefaultTheme];

      commentsFile.addExportAssignment({
        isExportEquals: false,
        expression: (writer) => {
          writer.write('defineThemeComments(');
          writeThemeStructure(writer, defaultTheme, 'object');
          writer.write(')');
        }
      });

      commentsFile.saveSync();
    }
  }

  update(): void {
    this._checkAndGenerateThemesCommentsFile();
  }

  create(): void {
    this._checkAndGenerateThemesCommentsFile();
  }

  init(): void {
    this._checkAndCreateThemesDir();
    this._checkAndCreateDefaultThemeDir();
    this._checkAndGenerateDefaultTheme();
  }
}
