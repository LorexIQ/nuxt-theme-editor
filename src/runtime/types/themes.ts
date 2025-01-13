import type { ComputedRef } from 'vue';
import type { ModuleDefineThemeBlockRootReturn } from './defines';
import type { ModuleObject } from './index';

export type ModuleServerThemes = { [name: string]: ModuleDefineThemeBlockRootReturn };
export type ModuleThemes = { [name: string]: ModuleThemeRootReturn };

export type ModuleThemeType = 'system' | 'global' | 'local';

export type ModuleThemeCleanedSetting<T = string> = ModuleObject<T> | ModuleThemeStyleBlockReturn<T>;
export type ModuleThemeStyleBlockReturn<T = string> = {
  id: string;
  styles: ModuleThemeCleanedSetting<T>[];
};

export type ModuleThemeRootReturn<T = string> = {
  id: string;
  name: string;
  description: string;
  type: ModuleThemeType;
  styles: ModuleThemeCleanedSetting<T>[];
};

type ThemeStyleValueType = string;
export type ModuleThemeStyleObject = ModuleObject<ThemeStyleValueType>;
export type ModuleThemeStyleBlock = ModuleThemeStyleBlockReturn<ThemeStyleValueType>;
export type ModuleThemeSelectedStyles = ModuleThemeStyleObject | ModuleThemeStyleBlock;
export type ModuleThemeScopes = ModuleObject<{
  scopesIds: string[];
  styles: ModuleThemeScopesStyles;
}>;
export type ModuleThemeScopesStyles = ModuleObject | ComputedRef<ModuleObject>;
export type ModuleThemeSelected = ModuleThemeRootReturn<ThemeStyleValueType> & {
  target: ModuleThemeRootReturn;
};

export type ModuleThemeEditData = {
  id: string;
  name: string;
  description: string;
  oldThemeId: string;
};
export type ModuleThemeCreateData = {
  id: string;
  name: string;
  description: string;
  parentThemeId?: string;
};
