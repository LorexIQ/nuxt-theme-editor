import type { ModuleOptions } from '../types';
import { useRuntimeConfig } from '#imports';

export class Client {
  private readonly options = useRuntimeConfig().public.themeEditor as ModuleOptions;
}
