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

  switchSlider: string;
  switchSliderChecked: string;
  switchSliderBorder: string;
  switchCircle: string;
  switchCircleChecked: string;
  switchCircleBorder: string;

  buttonDefaultBg: string;
  buttonDefaultBgHover: string;
  buttonDefaultBorder: string;
  buttonDefaultText: string;
  buttonDefaultTextHover: string;

  buttonSuccessBg: string;
  buttonSuccessBgHover: string;
  buttonSuccessBorder: string;
  buttonSuccessText: string;
  buttonSuccessTextHover: string;

  buttonErrorBg: string;
  buttonErrorBgHover: string;
  buttonErrorBorder: string;
  buttonErrorText: string;
  buttonErrorTextHover: string;

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
  contextMenuIconSuccess: string;
  contextMenuIconError: string;

  animationAlert: string;
  animationCircular: string;
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
