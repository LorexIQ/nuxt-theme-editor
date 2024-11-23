import type { ModuleObject } from './index';

export type ModuleDefineThemeMetaPreview = ModuleObject & Partial<{
  defaultPreviewCardBG1: string;
  defaultPreviewCardBG2: string;
  defaultPreviewCardBG3: string;
  defaultPreviewCardBG4: string;
  defaultPreviewCardBG5: string;
  defaultPreviewCardBG6: string;
}>;
export type ModuleDefineThemeMeta = {
  description?: string;
  previewCardStyles?: ModuleDefineThemeMetaPreview;
};
export type ModuleDefineThemeBlockSetting = ModuleObject | ModuleDefineThemeBlockReturn;

export type ModuleDefineThemeBlockReturn = {
  id: string;
  type: 'defineThemeBlock';
  styles: ModuleDefineThemeBlockSetting[];
};
export type ModuleDefineThemeBlockRootReturn = {
  id: 'global';
  type: 'defineThemeBlockRoot';
  meta: ModuleDefineThemeMeta;
  styles: ModuleDefineThemeBlockSetting[];
};
