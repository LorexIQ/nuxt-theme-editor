export default defineNuxtPlugin(() => {
  useState('test-auth', () => `Bearer ${useRuntimeConfig().public.env.serverToken}`);
});
