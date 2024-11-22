import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleDefineThemeMeta
} from './defines';
import type { ModuleObject } from './index';

export type ModuleServerThemes = { [name: string]: ModuleDefineThemeBlockRootReturn };
export type ModuleThemes = { [name: string]: ModuleThemeRootReturn };

export type ModuleThemeType = 'system' | 'global' | 'local';

export type ModuleDefineThemeCleanedSetting = ModuleObject | ModuleThemeStyleBlockReturn;

export type ModuleThemeStyleBlockReturn = {
  id: string;
  styles: ModuleDefineThemeCleanedSetting[];
};
export type ModuleThemeRootReturn = {
  name: string;
  type: ModuleThemeType;
  meta: Required<ModuleDefineThemeMeta>;
  styles: ModuleDefineThemeCleanedSetting[];
};
