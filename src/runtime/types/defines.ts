import type { ModuleObject } from './index';

export type ModuleDefineThemeMetaPreview = ModuleObject & Partial<{
  defaultPreviewCardBG1: string;
  defaultPreviewCardBG2: string;
  defaultPreviewCardBG3: string;
  defaultPreviewCardBG4: string;
  defaultPreviewCardBG5: string;
  defaultPreviewCardBG6: string;
}>;
export type ModuleDefineThemeMetaUI = Partial<{
  bg: string;
  bgHover: string;
  bgHeader: string;
  bgFooter: string;
  bgBlockHeader: string;
  bgGlass: string;
  blurGlass: string;
  shadow: string;
  border: string;
  title: string;
  titleTransparent: string;

  inputFocus: string;
  inputBg: string;
  inputRequired: string;
  inputTitle: string;
  inputText: string;
  inputPlaceholder: string;

  radioStatic: string;
  radioActive: string;

  buttonDefaultBg: string;
  buttonDefaultBgHover: string;
  buttonDefaultBorder: string;
  buttonDefaultText: string;
  buttonDefaultTextHover: string;

  buttonGreenBg: string;
  buttonGreenBgHover: string;
  buttonGreenBorder: string;
  buttonGreenText: string;
  buttonGreenTextHover: string;

  statusActiveBg: string;
  statusActiveTitle: string;
  statusLightDarkBg: string;
  statusLightDarkTitle: string;
  statusLightBg: string;
  statusLightTitle: string;
  statusDarkBg: string;
  statusDarkTitle: string;

  messageInfoBg: string;
  messageInfoTitle: string;
  messageInfoContent: string;
  messageTipBg: string;
  messageTipTitle: string;
  messageTipContent: string;
  messageWarnBg: string;
  messageWarnTitle: string;
  messageWarnContent: string;
  messageErrorBg: string;
  messageErrorTitle: string;
  messageErrorContent: string;

  contextMenuIcon: string;
  contextMenuIconActive: string;
}>;
export type ModuleDefineThemeMeta = {
  name?: string;
  description?: string;
  previewStyles?: ModuleDefineThemeMetaPreview;
  uiStyles?: ModuleDefineThemeMetaUI;
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
