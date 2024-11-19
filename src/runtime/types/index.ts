export * from './defines';

export type ModuleObject<T = string> = { [name: string]: T };

export type ModuleOptions = {
  nameDefaultTheme: string;
  themesDir: string;
  enableDefaultThemeGenerator: boolean;
};
