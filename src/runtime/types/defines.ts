import type { ModuleObject } from './index';

export type ModuleDefineThemeBlockSetting = ModuleObject | ModuleDefineThemeBlockReturn;

export type ModuleDefineThemeBlockBaseReturn = {
  id: string;
  type: string;
  styles: ModuleDefineThemeBlockSetting[];
};

export type ModuleDefineThemeBlockReturn = ModuleDefineThemeBlockBaseReturn & {
  type: 'defineThemeBlock';
};
export type ModuleDefineThemeBlockRootReturn = ModuleDefineThemeBlockBaseReturn & {
  type: 'defineThemeBlockRoot';
};
