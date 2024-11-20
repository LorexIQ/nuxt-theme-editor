import path from 'node:path';
import fs from 'node:fs';
import type { Nuxt } from '@nuxt/schema';
import { defineThemeBlock, defineThemeBlockRoot } from '../composables/defineThemeBlock';
import type { ModuleDefineThemeBlockRootReturn, ModuleOptions, ModuleThemesRAW } from '../types';
import globSync, { globSep } from '../helpers/globSync';
import { loadTsModule } from '../helpers/loadTsModule';
import logger from '../helpers/logger';

export class Server {
  private readonly rootDir: string;
  private readonly themesRAW: ModuleThemesRAW = {};

  constructor(
    private readonly nuxt: Nuxt,
    private readonly options: ModuleOptions
  ) {
    this.rootDir = globSep(path.join(nuxt.options.rootDir, options.themesDir));
  }

  async readThemes() {
    const indexThemesPaths = globSync(path.join(this.rootDir, '*', 'index.ts'));
    (global as any).defineThemeBlock = defineThemeBlock;
    (global as any).defineThemeBlockRoot = defineThemeBlockRoot;

    for (const themePath of indexThemesPaths) {
      if (!fs.existsSync(themePath)) {
        logger.warn(`Theme file wasn't found: '${themePath}'.`);
        continue;
      }

      const themeName = themePath.slice(this.rootDir.length + 1, themePath.lastIndexOf('/'));
      const themeFile = (await loadTsModule(themePath))?.default as ModuleDefineThemeBlockRootReturn;

      if (!themeFile) {
        logger.warn(`Error loading theme file: '${themePath}'.`);
        continue;
      } else if (themeFile.type !== 'defineThemeBlockRoot') {
        logger.warn(`Unknown define theme type: '${themePath}'. Use defineThemeEditorRoot as export default.`);
        continue;
      }

      this.themesRAW[themeName] = themeFile;
    }
  }

  getThemes() {
    return this.themesRAW;
  }
}
