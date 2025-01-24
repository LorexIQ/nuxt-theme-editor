export * from './apiSystem';
export * from './defines';
export * from './helpers';
export * from './metaFiles';
export * from './sandbox';
export * from './share';
export * from './storage';
export * from './themes';

export type ModuleObject<T = string> = { [name: string]: T };

export type ModuleOptions = {
  systemUUID: string;
  defaultTheme: string;
  themesDir: string;
  defaultDarkTheme?: string;
};

type ModuleOptionsExtendKeys = {
  state: string;
  storage: string;
  style: string;
  colorsHistory: string;
  sandbox: string;
  editor: string;
};
export type ModuleOptionsExtendMeta = {
  name: string;
  version: string;
  configKey: string;
};
export type ModuleOptionsExtend = ModuleOptions & {
  themes: string[];
  keys: ModuleOptionsExtendKeys;
  meta: ModuleOptionsExtendMeta;
};
