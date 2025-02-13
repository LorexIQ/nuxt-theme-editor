import type { ComputedRef } from 'vue';
import type { ModuleDefineThemeBlockRootReturn, ModuleDefineThemeBlockSettings } from './defines';
import type { ModuleObject, ModuleTheme } from './index';

export type ModuleServerThemes = { [name: string]: ModuleDefineThemeBlockRootReturn };
export type ModuleThemes = ModuleTheme[];

export type ModuleThemeType = 'system' | 'global' | 'local';

export type ModuleThemeCleanedStyles<T = string> = ModuleObject<T> | ModuleThemeStyleBlockReturn<T>;
export type ModuleThemeStyleBlockReturn<T = string> = {
  id: string;
  styles: ModuleThemeCleanedStyles<T>[];
  settings: ModuleDefineThemeBlockSettings;
};

export type ModuleThemeRAW<T = string> = {
  id: string;
  name: string;
  description: string;
  updatedAt: number;
  type: ModuleThemeType;
  styles: ModuleThemeCleanedStyles<T>[];
};

type ThemeStyleValueType = string;
export type ModuleThemeStyleObject = ModuleObject<ThemeStyleValueType>;
export type ModuleThemeStyleBlock = ModuleThemeStyleBlockReturn<ThemeStyleValueType>;
export type ModuleThemeSelectedStyles = ModuleThemeStyleObject | ModuleThemeStyleBlock;
export type ModuleThemeScopes = ModuleObject<{
  scopes: ModuleObject<number>;
  styles: ModuleThemeScopesStyles;
}>;
export type ModuleThemeScopesStyles = ModuleObject | ComputedRef<ModuleObject>;

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
