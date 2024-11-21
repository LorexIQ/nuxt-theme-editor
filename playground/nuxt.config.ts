export default defineNuxtConfig({
  modules: ['../src/module', '@nuxthub/core'],
  // modules: ['../dist/module', '@nuxthub/core'],
  plugins: ['./plugins/test.ts'],
  ssr: false,
  devtools: { enabled: true },

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
    defaultTheme: 'light'
  }
});
