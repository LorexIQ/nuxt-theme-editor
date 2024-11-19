import { Client } from '../classes/Client';
import { useState } from '#imports';

export default function () {
  const state = useState('nuxt-theme-editor:state', () => new Client());
  return state.value;
}
