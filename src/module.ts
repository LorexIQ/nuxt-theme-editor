import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit';
import defu from 'defu';
import { name, version } from '../package.json';
import type { ModuleOptions } from './runtime/types';
import { Server } from './runtime/classes/Server';

const MODULE_CONFIG_KEY = 'themesEditor';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: MODULE_CONFIG_KEY
  },
  defaults: {
    defaultTheme: 'light',
    themesDir: './themes',
    enableDefaultThemeGenerator: false
  },
  async setup(options, nuxt) {
    // @ts-ignore
    nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY] = defu(nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY], options);

    const resolver = createResolver(import.meta.url);
    const serverObject = new Server(nuxt, resolver);
    await serverObject.readThemes();

    // @ts-ignore
    nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY] = serverObject.getConfig();

    nuxt.hook('build:before', () => serverObject.createMeta());

    addImportsDir(resolver.resolve('./runtime/composables'));
    addPlugin(resolver.resolve('./runtime/plugin'));
  }
});
