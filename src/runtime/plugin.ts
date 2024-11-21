import clientGetter from './helpers/clientGetter';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin(() => {
  const client = clientGetter().value;
  console.log(client.getSelectedTheme());
});
