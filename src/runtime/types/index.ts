export * from './defines';
export * from './helpers';
export * from './sandbox';
export * from './storage';
export * from './themes';

export type ModuleObject<T = string> = { [name: string]: T };

export type ModuleOptions = {
  defaultTheme: string;
  defaultDarkTheme: string;
  themesDir: string;
  enableDefaultThemeGenerator: boolean;
};

type ModuleOptionsExtendKeys = {
  state: string;
  storage: string;
  style: string;
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
