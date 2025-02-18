const env = {
  serverOrigin: process.env.SERVER_ORIGIN ?? '',
  serverToken: process.env.SERVER_TOKEN ?? ''
};

export default defineNuxtConfig({
  modules: [
    // '../dist/module',
    '../src/module',
    // 'nuxt-theme-editor',
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

  runtimeConfig: {
    public: {
      env
    }
  },

  devServer: {
    port: 3001
  },

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
    systemUUID: 'system-HASD',
    themesConfig: {
      system: {
        default: 'light'
      },
      global: {
        enabled: true,
        origin: env.serverOrigin,
        editingAllowedUseStateKey: 'test-editing',
        authorizationUseStateKey: 'test-auth',
        addSlashToTheEndRequest: true
      }
    },
    localization: {
      type: 'system',
      lang: 'RU'
    }
  }
});
