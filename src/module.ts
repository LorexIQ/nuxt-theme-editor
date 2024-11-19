import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit';
import defu from 'defu';
import { name, version } from '../package.json';
import type { ModuleOptions } from './runtime/types';
import { Server } from './runtime/classes/Server';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'themeEditor'
  },
  defaults: {
    nameDefaultTheme: 'main',
    themesDir: './themes',
    enableDefaultThemeGenerator: false
  },
  setup(options, nuxt) {
    // @ts-ignore
    nuxt.options.runtimeConfig.public['themeEditor'] = defu(nuxt.options.runtimeConfig.public['themeEditor'], options);
    const resolver = createResolver(import.meta.url);
    const serverObject = new Server(nuxt, options);

    addImportsDir(resolver.resolve('./runtime/composables'));
    addPlugin(resolver.resolve('./runtime/plugin'));
  }
});
