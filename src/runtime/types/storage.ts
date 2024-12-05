import type { ModuleThemes } from './themes';

export type ModuleStorage = {
  isAutoThemeMode: boolean;
  localThemes: ModuleThemes;
  selectedSelfThemeId?: string;
  selectedLightThemeId?: string;
  selectedDarkThemeId?: string;
};
