import type { ModuleThemeRAW } from './themes';

export type ModuleLocalStorageThemeTimestamp = {
  timestamp: number;
};
export type ModuleLocalStorageThemeMini = ModuleLocalStorageThemeTimestamp & {
  id: string;
  name: string;
  description: string;
  previewStylesJSON: string;
};
export type ModuleLocalStorageTheme = ModuleLocalStorageThemeMini & {
  stylesJSON: string;
};
export type ModuleLocalStorageThemeCreate = Omit<ModuleLocalStorageTheme, 'timestamp'>;
export type ModuleLocalStorageThemeEdit = Partial<ModuleLocalStorageThemeCreate>;

export type ModuleStorage = {
  isAutoThemeMode: boolean;
  localThemes: ModuleThemeRAW[];
  globalThemesCache: ModuleThemeRAW[];
  selectedMainThemeId?: string;
  selectedLightThemeId?: string;
  selectedDarkThemeId?: string;
};
