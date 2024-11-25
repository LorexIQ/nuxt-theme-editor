import fs from 'node:fs';
import type { Nuxt } from '@nuxt/schema';
import type { Resolver } from '@nuxt/kit';
import defineThemeBlock from '../composables/defineThemeBlock';
import defineThemeBlockRoot from '../composables/defineThemeBlockRoot';
import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleOptions,
  ModuleOptionsExtend, ModuleOptionsExtendMeta, ModuleServerThemes
} from '../types';
import uPath from '../helpers/uPath';
import logger from '../helpers/logger';
import tsMorphProject from '../helpers/tsMorphProject';
import { loadTsModule } from '../helpers/loadTsModule';
import { MetaFiles } from './MetaFiles';

(global as any).defineThemeBlock = defineThemeBlock;
(global as any).defineThemeBlockRoot = defineThemeBlockRoot;

export class Server {
  private readonly config: ModuleOptionsExtend;
  private readonly rootDir: string;
  private readonly rootThemesDir: string;

  private readonly themes: ModuleServerThemes = {};
  private readonly themesPaths: Set<string> = new Set();
  private readonly themesNames: Set<string> = new Set();

  private readonly metaFiles: MetaFiles;

  constructor(
    private readonly nuxt: Nuxt,
    private readonly meta: ModuleOptionsExtendMeta,
    private readonly resolver: Resolver
  ) {
    this.config = this._initConfig(this.nuxt.options.runtimeConfig.public.themesEditor as any);
    this.rootDir = this.nuxt.options.rootDir;
    this.rootThemesDir = uPath.join(this.rootDir, this.config.themesDir);
    this.metaFiles = new MetaFiles(this);

    this._initThemesDir();
  }

  private _initConfig(options: ModuleOptions): ModuleOptionsExtend {
    return {
      ...options,
      themes: [],
      keys: {
        state: 'nuxt-themes-editor:state',
        storage: 'nuxt-themes-editor:selected-theme',
        style: 'nuxt-themes-editor:style',
        sandbox: 'nuxt-themes-editor:sandbox',
        editor: 'nuxt-themes-editor:editor'
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

    if (this.config.enableDefaultThemeGenerator && !fs.existsSync(defaultThemePath)) {
      logger.info('Default theme generation...');

      if (!fs.existsSync(defaultThemeDir)) {
        fs.mkdirSync(defaultThemeDir);
      }
      const themeIndexFile = tsMorphProject.createSourceFile(defaultThemePath, '', { overwrite: true });

      themeIndexFile.removeDefaultExport();
      themeIndexFile.addExportAssignment({
        isExportEquals: false,
        expression: 'defineThemeBlockRoot({}, [])'
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

  getRootDir(): string {
    return this.rootDir;
  }

  getThemesPaths(): string[] {
    return Array.from(this.themesPaths);
  }

  getThemes(): ModuleServerThemes {
    return this.themes;
  }

  getResolver(): Resolver {
    return this.resolver;
  }

  getConfig(): ModuleOptionsExtend {
    return {
      ...this.config,
      themes: [...this.themesNames]
    };
  }

  getMetaFiles() {
    return this.metaFiles;
  }
}
