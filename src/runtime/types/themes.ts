import type iconsConnector from '../helpers/iconsConnector';
import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleDefineThemeMeta
} from './defines';
import type { ModuleObject } from './index';

export type ModuleServerThemes = { [name: string]: ModuleDefineThemeBlockRootReturn };
export type ModuleThemes = { [name: string]: ModuleThemeRootReturn };

export type ModuleThemeType = 'system' | 'global' | 'local';
export type ModulePages = 'index' | 'newTheme' | string;
export type ModulePageAnimations = 'tab-fade-lr' | 'tab-fade-rl' | undefined;
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
