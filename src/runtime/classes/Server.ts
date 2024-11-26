import fs from 'node:fs';
import type { Nuxt } from '@nuxt/schema';
import { createResolver, type Resolver } from '@nuxt/kit';
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
  private readonly rootResolver: Resolver;
  private readonly themesResolver: Resolver;

  private readonly themes: ModuleServerThemes = {};
  private readonly themesDirs: Set<string> = new Set();
  private readonly themesPaths: Set<string> = new Set();
  private readonly themesNames: Set<string> = new Set();

  private readonly metaFiles: MetaFiles;

  constructor(
    private readonly nuxt: Nuxt,
    private readonly meta: ModuleOptionsExtendMeta,
    private readonly resolver: Resolver
  ) {
    this.config = this._initConfig(this.nuxt.options.runtimeConfig.public.themesEditor as any);
    this.rootResolver = createResolver(this.nuxt.options.rootDir);
    this.themesResolver = createResolver(this.rootResolver.resolve(this.config.themesDir));
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
    const themesDir = this.themesResolver.resolve();
    if (!fs.existsSync(themesDir)) {
      fs.mkdirSync(themesDir, { recursive: true });
    }
  }

  async checkAndGenerateDefaultTheme(): Promise<void> {
    const defaultThemeDir = this.themesResolver.resolve(this.config.defaultTheme);
    const defaultThemePath = this.themesResolver.resolve(this.config.defaultTheme, 'index.ts');

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

  async readThemeByPath(indexPath: string): Promise<boolean> {
    if (!fs.existsSync(indexPath)) {
      logger.warn(`Theme file wasn't found: '${indexPath}'.`);
      return false;
    }

    const themeName = indexPath.slice(this.themesResolver.resolve().length + 1, indexPath.lastIndexOf('/'));
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

    this.themesDirs.add(uPath.parse(indexPath).dir);
    this.themesPaths.add(indexPath);
    this.themesNames.add(themeName);
    this.themes[themeName] = themeFile;
    return true;
  }

  async readThemes(): Promise<void> {
    this.themesPaths.clear();
    this.themesNames.clear();
    this.themesDirs.clear();
    Object.keys(this.themes).forEach(key => delete this.themes[key]);

    const indexThemesPaths = uPath.glob(this.themesResolver.resolve('*', 'index.ts'));

    for (const themePath of indexThemesPaths) {
      await this.readThemeByPath(themePath);
    }
  }

  getRootResolver(): Resolver {
    return this.rootResolver;
  }

  getThemesResolver(): Resolver {
    return this.themesResolver;
  }

  getThemesPaths(): string[] {
    return Array.from(this.themesPaths);
  }

  getThemesDirs(): string[] {
    return Array.from(this.themesDirs);
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
