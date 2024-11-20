export default defineNuxtConfig({
  modules: ['../src/module', '@nuxthub/core'],
  // modules: ['../dist/module', '@nuxthub/core'],
  plugins: ['./plugins/test.ts'],
  ssr: false,
  devtools: { enabled: true },
  compatibilityDate: '2024-11-18',
  themeEditor: {}
});
