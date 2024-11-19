import type { ModuleObject } from './index';

export type ModuleDefineThemeBlockSetting = ModuleObject | ModuleDefineThemeBlockReturn;
export type ModuleDefineThemeBlockReturn = {
  type: 'defineThemeBlock';
  prefix: string;
  styles: ModuleObject;
};
