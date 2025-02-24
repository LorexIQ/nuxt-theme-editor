type ModuleEvBusClose = {
  type: 'close';
};
type ModuleEvBusThemeBlockStatus = {
  type: 'themeBlockStatus';
  scope: 'system' | 'global' | 'local';
  status: 0 | 1 | 2;
};
type ModuleEvBusUpdateStorage = {
  type: 'updateStorage';
};

export type ModuleEvBus =
  | ModuleEvBusClose
  | ModuleEvBusThemeBlockStatus
  | ModuleEvBusUpdateStorage;
