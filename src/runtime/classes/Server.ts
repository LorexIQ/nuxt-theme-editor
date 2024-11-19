import type { Nuxt } from '@nuxt/schema';
import type { ModuleOptions } from '../types';

export class Server {
  constructor(
    private readonly nuxt: Nuxt,
    private readonly options: ModuleOptions
  ) {

  }
}
