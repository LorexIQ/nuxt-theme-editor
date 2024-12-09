import type {
  ModuleClient,
  ModuleObject,
  ModuleOptionsExtend,
  ModulePage,
  ModulePageAnimations,
  ModulePagesNames
} from '../../types';
import unwrap from '../../helpers/client/unwrap';
import pagesMeta from '../../assets/pagesMeta';
import { computed, ref } from '#imports';

export class Router {
  private readonly config: ModuleOptionsExtend;
  private readonly pages = pagesMeta;

  private readonly fullPath = ref<ModulePagesNames>('index');
  private readonly transitionName = ref<ModulePageAnimations>();
  private readonly currentPage = computed(() => this.pages.find(page => page.name === unwrap.get(this.path)));
  private readonly path = computed(() => this._validatePath(this.fullPath.value.split('?')[0]));
  private readonly query = computed(() => {
    const queries = this.fullPath.value.split('?').slice(1).join('?');
    if (queries.length) return queries.split('&').reduce((acc, query) => {
      const queryParts = query.split('=');
      if (queryParts.length === 2) return ({ ...acc, [queryParts[0]]: queryParts[1] });
      else return acc;
    }, {});
    else return {};
  });

  constructor(private readonly ctx: ModuleClient) {
    this.config = this.ctx.getConfig();
  }

  private _validatePath(path: string): string {
    return this.pages.find(page => page.name === path) ? path : '404';
  }

  push(page: ModulePagesNames, animation?: ModulePageAnimations): void {
    unwrap.set(this, 'transitionName', animation);
    unwrap.set(this, 'fullPath', page);
  }

  getFullPath(): string {
    return unwrap.get(this.fullPath);
  }

  getTransitionName(): ModulePageAnimations {
    return unwrap.get(this.transitionName);
  }

  getCurrentPage(): ModulePage | undefined {
    return unwrap.get(this.currentPage);
  }

  getPath(): ModulePagesNames {
    return unwrap.get(this.path);
  }

  getQuery(): ModuleObject {
    return unwrap.get(this.query);
  }
}
