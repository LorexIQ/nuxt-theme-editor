import type { DeepPartial, DeepRequired } from './helpers';
import type { ModuleLang, ModuleLocalizationStructure } from './localization';

export * from './apiSystem';
export * from './defines';
export * from './evBus';
export * from './helpers';
export * from './localization';
export * from './metaFiles';
export * from './sandbox';
export * from './share';
export * from './storage';
export * from './themes';

export type ModuleObject<T = string> = { [name: string]: T };

export type ModuleOptionsThemesConfigSystem = {
  themesDir?: string;
  default?: string;
  defaultDark?: string;
};
export type ModuleOptionsThemesConfigGlobal = {
  enabled: boolean;
  origin: string;
  awaitTicksBeforeInitFetch?: number;
  editingAllowedUseStateKey?: string | null;
  authorizationUseStateKey?: string | null;
  addSlashToTheEndRequest?: boolean;
};
export type ModuleOptionsThemesConfigLocal = {
  enabled: boolean;
};

export type ModuleOptionsThemesConfig = {
  system?: ModuleOptionsThemesConfigSystem;
  global?: ModuleOptionsThemesConfigGlobal;
  local?: ModuleOptionsThemesConfigLocal;
};

export type ModuleOptionsLocalizationDefaults = {
  type: 'system';
  lang: ModuleLang;
};
export type ModuleOptionsLocalizationCustom = {
  type: 'custom';
  translations: DeepPartial<ModuleLocalizationStructure>;
  parentLang: ModuleLang;
};
export type ModuleOptionsLocalization =
  | ModuleOptionsLocalizationDefaults
  | ModuleOptionsLocalizationCustom;

export type ModuleOptions = {
  systemUUID: string;
  themesConfig: ModuleOptionsThemesConfig;
  localization: ModuleOptionsLocalization;
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
export type ModuleOptionsExtend = DeepRequired<Omit<ModuleOptions, 'localization'>> & {
  localization: ModuleOptionsLocalization;
  themesNames: string[];
  keys: ModuleOptionsExtendKeys;
  meta: ModuleOptionsExtendMeta;
};
