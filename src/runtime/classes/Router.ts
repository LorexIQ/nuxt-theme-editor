import type { ModuleObject, ModuleOptionsExtend, ModulePageAnimations, ModulePages } from '../types';
import unwrap from '../helpers/unwrap';
import type { Client } from './Client';
import { computed, ref } from '#imports';

export class Router {
  private readonly config: ModuleOptionsExtend;

  private readonly fullPath = ref<ModulePages>('index');
  private readonly transitionName = ref<ModulePageAnimations>();
  private readonly path = computed(() => this.fullPath.value.split('?')[0]);
  private readonly query = computed(() => {
    const queries = this.fullPath.value.split('?').slice(1).join('?');
    if (queries.length) return queries.split('&').reduce((acc, query) => {
      const queryParts = query.split('=');
      if (queryParts.length === 2) return ({ ...acc, [queryParts[0]]: queryParts[1] });
      else return acc;
    }, {});
    else return {};
  });

  constructor(private readonly ctx: Client) {
    this.config = this.ctx.getConfig();
  }

  push(page: ModulePages, animation?: ModulePageAnimations): void {
    unwrap.set(this, 'transitionName', animation);
    unwrap.set(this, 'fullPath', page);
  }

  getFullPath(): string {
    return unwrap.get(this.fullPath);
  }

  getTransitionName(): ModulePageAnimations {
    return unwrap.get(this.transitionName);
  }

  getPath(): string {
    return unwrap.get(this.path);
  }

  getQuery(): ModuleObject {
    return unwrap.get(this.query);
  }
}
