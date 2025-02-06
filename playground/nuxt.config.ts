export default defineNuxtConfig({
  // modules: ['../dist/module', '@nuxthub/core'],
  modules: ['../src/module', '@nuxthub/core'],

  plugins: ['./plugins/AUTH.ts'],

  ssr: false,

  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  css: [
    './assets/main.scss'
  ],

  compatibilityDate: '2024-11-18',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern'
        }
      }
    }
  },

  themesEditor: {
    themesConfig: {
      system: {
        default: 'light'
      },
      global: {
        enabled: true,
        mode: 'nodeLocalStorage',
        editingAllowedUseStateKey: 'test-editing'
      }
    }
  }
});
