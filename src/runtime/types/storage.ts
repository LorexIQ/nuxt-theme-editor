import type { ModuleThemeRAW } from './themes';

export type ModuleLocalStorageThemeFull = {
  id: string;
  name: string;
  description: string;
  previewJSON: string;
  stylesJSON: string;
};
export type ModuleLocalStorageThemeEdit = Partial<ModuleLocalStorageThemeFull>;

export type ModuleStorage = {
  isAutoThemeMode: boolean;
  localThemes: ModuleThemeRAW[];
  selectedMainThemeId?: string;
  selectedLightThemeId?: string;
  selectedDarkThemeId?: string;
};
