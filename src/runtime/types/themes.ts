import type iconsConnector from '../assets/iconsConnector';
import type pagesMeta from '../assets/pagesMeta';
import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleDefineThemeMeta
} from './defines';
import type { ModuleObject } from './index';

export type ModuleServerThemes = { [name: string]: ModuleDefineThemeBlockRootReturn };
export type ModuleThemes = { [name: string]: ModuleThemeRootReturn };

export type ModulePage = { name: string; title: string };
export type ModuleThemeType = 'system' | 'global' | 'local';
export type ModulePageAnimations = 'tab-fade-lr' | 'tab-fade-rl' | undefined;
export type ModulePagesNames = (typeof pagesMeta extends { name: infer U }[] ? U : never) | string;
export type ModuleIcons = keyof typeof iconsConnector;

export type ModuleThemeCleanedSetting = ModuleObject | ModuleThemeStyleBlockReturn;

export type ModuleThemeStyleBlockReturn = {
  id: string;
  styles: ModuleThemeCleanedSetting[];
};
export type ModuleThemeRootReturn = {
  id: string;
  name: string;
  type: ModuleThemeType;
  meta: Required<ModuleDefineThemeMeta>;
  styles: ModuleThemeCleanedSetting[];
};
