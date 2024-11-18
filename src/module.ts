import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';
import defu from 'defu';
import { name, version } from '../package.json';
import type { ModuleOptions } from './runtime/types';

const MODULE_CONFIG_KEY = 'themeEditor';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: MODULE_CONFIG_KEY
  },
  defaults: {},
  setup(options, nuxt) {
    // @ts-ignore
    nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY] = defu(nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY], options);
    const resolver = createResolver(import.meta.url);

    addPlugin(resolver.resolve('./runtime/plugin'));
  }
});
