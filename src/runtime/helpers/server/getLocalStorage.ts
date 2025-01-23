import { LocalStorage } from 'node-localstorage';
import { useRuntimeConfig } from '#imports';

export default function () {
  if (!global.localStorage) {
    const storagePath = (useRuntimeConfig()['themesEditor'] as any).storagePath;
    (global.localStorage as any) = new LocalStorage(storagePath);
  }

  return global.localStorage;
}
