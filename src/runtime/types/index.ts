export * from './defines';
export * from './helpers';
export * from './themes';

export type ModuleObject<T = string> = { [name: string]: T };

export type ModuleOptions = {
  defaultTheme: string;
  themesDir: string;
  enableDefaultThemeGenerator: boolean;
};

type ModuleOptionsExtendKeys = {
  state: string;
  storage: string;
  style: string;
};
export type ModuleOptionsExtend = ModuleOptions & {
  themes: string[];
  keys: ModuleOptionsExtendKeys;
};
