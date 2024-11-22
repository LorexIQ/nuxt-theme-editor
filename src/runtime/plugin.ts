import clientGetter from './helpers/clientGetter';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin(() => {
  clientGetter();
});
