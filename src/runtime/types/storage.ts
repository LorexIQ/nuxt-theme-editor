import type { ModuleThemeRAW } from './themes';

export type ModuleStorage = {
  isAutoThemeMode: boolean;
  localThemes: ModuleThemeRAW[];
  selectedSelfThemeId?: string;
  selectedLightThemeId?: string;
  selectedDarkThemeId?: string;
};
