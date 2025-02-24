import type { ModuleThemeCleanedStyles } from './themes';
import type { ModulePagesNames } from './share';

type ModuleEvBusClose = {
  type: 'close';
  page: ModulePagesNames;
};
type ModuleEvBusThemeBlockStatus = {
  type: 'themeBlockStatus';
  scope: 'system' | 'global' | 'local';
  status: 0 | 1 | 2;
};
type ModuleEvBusUpdateStorage = {
  type: 'updateStorage';
};
type ModuleEvBusThemeEditedStatus = {
  type: 'themeEditedStatus';
  id?: string;
};
type ModuleEvBusThemeEditStyles = {
  type: 'themeEditStyles';
  styles: ModuleThemeCleanedStyles[];
};

export type ModuleEvBusClient =
  | ModuleEvBusClose
  | ModuleEvBusThemeBlockStatus
  | ModuleEvBusUpdateStorage
  | ModuleEvBusThemeEditedStatus;
export type ModuleEvBusTheme =
  | ModuleEvBusThemeEditStyles;

export type ModuleEvBusClientExtend = { scope: 'client' } & ModuleEvBusClient;
export type ModuleEvBusThemeExtend = { scope: 'theme' } & ModuleEvBusTheme;
