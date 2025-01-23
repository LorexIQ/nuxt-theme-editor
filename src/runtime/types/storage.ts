import type { ModuleThemeRAW } from './themes';

export type ModuleLocalStorageThemeFull = {
  id: string;
  name: string;
  description: string;
  stylesJSON: string;
};
export type ModuleLocalStorageThemeEdit = Omit<ModuleLocalStorageThemeFull, 'id'>;

export type ModuleStorage = {
  isAutoThemeMode: boolean;
  localThemes: ModuleThemeRAW[];
  selectedMainThemeId?: string;
  selectedLightThemeId?: string;
  selectedDarkThemeId?: string;
};
