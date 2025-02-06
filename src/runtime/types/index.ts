import type { DeepRequired } from './helpers';

export * from './apiSystem';
export * from './defines';
export * from './helpers';
export * from './metaFiles';
export * from './sandbox';
export * from './share';
export * from './storage';
export * from './themes';

export type ModuleObject<T = string> = { [name: string]: T };

export type ModuleOptionsGlobalNodeLocalStorage = {
  mode: 'nodeLocalStorage';
};
export type ModuleOptionsGlobalCustomAPI = {
  mode: 'customAPI';
  origin: string;
  authorizationUseStateKey?: string;
};

export type ModuleOptionsThemesConfigSystem = {
  default: string;
  defaultDark?: string;
};
export type ModuleOptionsThemesConfigGlobal = {
  enabled: boolean;
  editingAllowedUseStateKey?: string;
} & (
  | ModuleOptionsGlobalNodeLocalStorage
  | ModuleOptionsGlobalCustomAPI
  );
export type ModuleOptionsThemesConfigLocal = {
  enabled: boolean;
};

export type ModuleOptionsThemesConfig = {
  system?: ModuleOptionsThemesConfigSystem;
  global?: ModuleOptionsThemesConfigGlobal;
  local?: ModuleOptionsThemesConfigLocal;
};

export type ModuleOptions = {
  systemUUID: string;
  themesDir: string;
  themesConfig: ModuleOptionsThemesConfig;
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
export type ModuleOptionsAccessTokens = {
  baseAuthorizationToken: string;
  fullAuthorizationToken: string;
};
export type ModuleOptionsExtend = DeepRequired<ModuleOptions> & {
  themesNames: string[];
  keys: ModuleOptionsExtendKeys;
  tokens: ModuleOptionsAccessTokens;
  meta: ModuleOptionsExtendMeta;
};
