import type { Component } from 'vue';
import type {
  ModuleClient,
  ModuleObject,
  ModuleOptionsExtend,
  ModulePageAnimations,
  ModulePagesNames
} from '../../types';
import unwrap from '../../helpers/client/unwrap';
import pagesMeta from '../../assets/pagesMeta';
import utils from '../../helpers/utils';
import { computed, reactive, ref } from '#imports';

type ModuleRouterPage = {
  name: ModulePagesNames;
  title: string;
  component: Component;
};
type ModuleRouterRoute = {
  fullPath: ModulePagesNames;
  path: string;
  page?: ModuleRouterPage;
  title?: string;
  query: ModuleObject;
};

export class Router {
  private readonly config: ModuleOptionsExtend;
  private readonly pages = pagesMeta;

  public readonly route: ModuleRouterRoute = reactive({
    fullPath: 'index',
    path: computed<string>(() => this._validatePath(this.route.fullPath.split('?')[0])),
    page: computed(() => this.pages.find(page => page.name === this.route.path)),
    title: computed(() => this.route.page?.title),
    query: computed<ModuleObject>(() => {
      const queries = this.route.fullPath.split('?').slice(1).join('?');
      if (queries.length) return queries.split('&').reduce((acc, query) => {
        const queryParts = query.split('=');
        if (queryParts.length === 2) return ({ ...acc, [queryParts[0]]: queryParts[1] });
        else return acc;
      }, {});
      else return {};
    })
  });
  public readonly oldRoute = ref<ModuleRouterRoute>();

  private readonly transitionName = ref<ModulePageAnimations>();

  constructor(private readonly ctx: ModuleClient) {
    this.config = this.ctx.getConfig();
  }

  private _validatePath(path: string): string {
    return this.pages.find(page => page.name === path) ? path : '404';
  }

  push(page: ModulePagesNames, animation?: ModulePageAnimations): void {
    unwrap.set(this, 'transitionName', animation);
    unwrap.set(this, 'oldRoute', utils.copyObject(this.route));
    this.route.fullPath = page;
  }

  getTransitionName(): ModulePageAnimations {
    return unwrap.get(this.transitionName);
  }
}
