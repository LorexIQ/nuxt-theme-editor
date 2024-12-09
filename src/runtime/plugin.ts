import useClient from './helpers/client/useClient';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin(() => {
  useClient();
});
