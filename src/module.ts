import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  installModule,
  addComponentsDir
} from '@nuxt/kit';
import defu from 'defu';
import { name, version } from '../package.json';
import type { ModuleOptions } from './runtime/types';
import { Server } from './runtime/classes/server/Server';
import api from './runtime/api';

const MODULE_CONFIG_KEY = 'themesEditor';
const meta = {
  name,
  version,
  configKey: MODULE_CONFIG_KEY
};

export default defineNuxtModule<ModuleOptions>({
  meta,
  defaults: {
    systemUUID: 'system',
    defaultTheme: 'light',
    themesDir: './themes'
  },
  async setup(options, nuxt) {
    // @ts-ignore
    nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY] = defu(nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY], options);

    const resolver = createResolver(import.meta.url);
    const serverObject = new Server(nuxt, meta, resolver);
    await serverObject.readThemes();
    serverObject.getThemesFiles().create();

    // @ts-ignore
    nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY] = serverObject.getConfig();

    nuxt.hook('builder:watch', (_, path) => serverObject.checkThemeChangesWithAction(path));
    nuxt.hook('build:before', () => serverObject.getMetaFiles().create());

    addImportsDir(resolver.resolve('./runtime/composables'));
    addPlugin(resolver.resolve('./runtime/plugin'));

    await installModule('nuxt-transition-expand');
    await installModule('nuxt-color-picker');
    await addComponentsDir({
      path: resolver.resolve('./runtime/components/exports')
    });

    const apiResolver = createResolver(resolver.resolve('./runtime/api'));
    nuxt.options.runtimeConfig[MODULE_CONFIG_KEY] = { storagePath: apiResolver.resolve('../meta/storage') };
    api(apiResolver);
  }
});
