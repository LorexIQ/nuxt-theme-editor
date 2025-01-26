import type { ModuleThemeRAW } from './themes';

export type ModuleLocalStorageThemeMini = {
  id: string;
  name: string;
  description: string;
  previewStylesJSON: string;
};
export type ModuleLocalStorageTheme = ModuleLocalStorageThemeMini & {
  stylesJSON: string;
};
export type ModuleLocalStorageThemeEdit = Partial<ModuleLocalStorageTheme>;

export type ModuleStorage = {
  isAutoThemeMode: boolean;
  localThemes: ModuleThemeRAW[];
  globalThemeCache: ModuleThemeRAW | null;
  selectedMainThemeId?: string;
  selectedLightThemeId?: string;
  selectedDarkThemeId?: string;
};
