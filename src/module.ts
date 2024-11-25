import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addComponent, installModule } from '@nuxt/kit';
import defu from 'defu';
import { name, version } from '../package.json';
import type { ModuleOptions } from './runtime/types';
import { Server } from './runtime/classes/Server';

const MODULE_CONFIG_KEY = 'themesEditor';
const meta = {
  name,
  version,
  configKey: MODULE_CONFIG_KEY
};

export default defineNuxtModule<ModuleOptions>({
  meta,
  defaults: {
    defaultTheme: 'light',
    themesDir: './themes',
    enableDefaultThemeGenerator: true
  },
  async setup(options, nuxt) {
    // @ts-ignore
    nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY] = defu(nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY], options);

    const resolver = createResolver(import.meta.url);
    const serverObject = new Server(nuxt, meta, resolver);
    await serverObject.checkAndGenerateDefaultTheme();
    await serverObject.readThemes();

    // @ts-ignore
    nuxt.options.runtimeConfig.public[MODULE_CONFIG_KEY] = serverObject.getConfig();

    nuxt.hook('builder:watch', (_, path) => serverObject.getMetaFiles().checkPathAndUpdate(path));
    nuxt.hook('build:before', () => serverObject.getMetaFiles().create());

    addImportsDir(resolver.resolve('./runtime/composables'));
    addPlugin(resolver.resolve('./runtime/plugin'));

    await installModule('nuxt-transition-expand');
    await addComponent({
      name: 'themesEditor',
      filePath: resolver.resolve('./runtime/components/themesEditor.vue')
    });
  }
});
