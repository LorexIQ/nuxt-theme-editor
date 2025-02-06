import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import type { Nuxt } from '@nuxt/schema';
import { createResolver, type Resolver } from '@nuxt/kit';
import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleMetaFilesWatcherHash,
  ModuleOptions,
  ModuleOptionsExtend,
  ModuleOptionsExtendMeta,
  ModuleServerThemes
} from '../../types';
import defineThemeBlock from '../../composables/defineThemeBlock';
import defineThemeBlockRoot from '../../composables/defineThemeBlockRoot';
import uPath from '../../helpers/server/uPath';
import logger from '../../helpers/server/logger';
import { loadTsModule } from '../../helpers/server/loadTsModule';
import { MetaFiles } from './MetaFiles';
import { ThemesFiles } from './ThemesFiles';

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
  private readonly themesFiles: ThemesFiles;

  private readonly watcherHash: ModuleMetaFilesWatcherHash = {};
  private watcherLastUpdate = Date.now();

  constructor(
    private readonly nuxt: Nuxt,
    private readonly meta: ModuleOptionsExtendMeta,
    private readonly resolver: Resolver
  ) {
    this.config = this._initConfig(this.nuxt.options.runtimeConfig.public.themesEditor as any);
    this.rootResolver = createResolver(this.nuxt.options.rootDir);
    this.themesResolver = createResolver(this.rootResolver.resolve(this.config.themesDir));

    this.metaFiles = new MetaFiles(this);
    this.themesFiles = new ThemesFiles(this);

    this.themesFiles.init();
  }

  private _initConfig(options: ModuleOptions): ModuleOptionsExtend {
    return {
      ...options,
      themesConfig: {
        system: {
          default: 'light',
          ...options.themesConfig.system
        },
        global: {
          enabled: false,
          mode: 'nodeLocalStorage',
          ...options.themesConfig.global
        },
        local: {
          enabled: false,
          ...options.themesConfig.local,
          ...(options.themesConfig.global?.enabled ? { enabled: true } : {})
        }
      },
      themesNames: [],
      keys: {
        state: 'nuxt-themes-editor:state',
        storage: 'nuxt-themes-editor:settings',
        style: 'nuxt-themes-editor:style',
        colorsHistory: 'nuxt-themes-editor',
        sandbox: 'nuxt-themes-editor:sandbox',
        editor: 'nuxt-themes-editor:editor'
      },
      tokens: {
        baseAuthorizationToken: `${randomUUID()}-${randomUUID()}`,
        fullAuthorizationToken: `${randomUUID()}-${randomUUID()}`
      },
      meta: this.meta
    };
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

  async checkThemeChangesWithAction(path: string): Promise<void> {
    const pathFull = this.rootResolver.resolve(path);

    if (this.watcherHash[path] === undefined) this.watcherHash[path] = pathFull.endsWith(`/${this.config.themesConfig.system.default}/index.ts`);
    if (!this.watcherHash[path]) return;
    if (Date.now() - this.watcherLastUpdate < 2000) return;

    await this.readThemeByPath(pathFull);
    this.themesFiles.update();
    this.metaFiles.update();
    this.watcherLastUpdate = Date.now();
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
      themesNames: [...this.themesNames]
    };
  }

  getMetaFiles(): MetaFiles {
    return this.metaFiles;
  }

  getThemesFiles(): ThemesFiles {
    return this.themesFiles;
  }
}
