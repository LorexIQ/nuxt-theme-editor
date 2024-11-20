export * from './defines';
export * from './themes';

export type ModuleObject<T = string> = { [name: string]: T };

export type ModuleOptions = {
  nameDefaultTheme: string;
  themesDir: string;
  enableDefaultThemeGenerator: boolean;
};
