import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleDefineThemeMeta
} from './defines';
import type { ModuleObject } from './index';

export type ModuleServerThemes = { [name: string]: ModuleDefineThemeBlockRootReturn };
export type ModuleThemes = { [name: string]: ModuleThemeRootReturn };

export type ModuleThemeType = 'system' | 'global' | 'local';
export type ModuleIcons = 'Arrow' | 'Check' | 'Plus';

export type ModuleThemeCleanedSetting = ModuleObject | ModuleThemeStyleBlockReturn;

export type ModuleThemeStyleBlockReturn = {
  id: string;
  styles: ModuleThemeCleanedSetting[];
};
export type ModuleThemeRootReturn = {
  name: string;
  type: ModuleThemeType;
  meta: Required<ModuleDefineThemeMeta>;
  styles: ModuleThemeCleanedSetting[];
};
