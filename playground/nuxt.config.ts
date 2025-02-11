export default defineNuxtConfig({
  modules: [
    // '../dist/module',
    // '../src/module',
    'nuxt-theme-editor',
    '@nuxthub/core'
  ],

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
        origin: '/'
      }
    },
    localization: {
      type: 'system',
      lang: 'EN'
    }
  }
});
