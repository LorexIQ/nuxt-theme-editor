import type { ModuleObject } from './index';

export type ModuleDefineThemeMetaPreview = ModuleObject & Partial<{
  bg1: string;
  bg2: string;
  bg3: string;
  bg4: string;
  bg5: string;
  bg6: string;
}>;
export type ModuleDefineThemeMetaUI = Partial<{
  bg: string;
  bgHover: string;
  bgFooter: string;
  bgBlockHeader: string;
  bgThemeBlock: string;
  bgAddThemeButton: string;
  bgGlass: string;
  shadow: string;
  border: string;
  title: string;
  titleTransparent: string;

  headerBg: string;
  headerTitle: string;
  headerButtonPopup: string;
  headerButtonClose: string;

  inputFocus: string;
  inputBg: string;
  inputRequired: string;
  inputTitle: string;
  inputText: string;
  inputPlaceholder: string;
  inputPostIcon: string;
  inputBorder: string;

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
  statusCacheBg: string;
  statusCacheTitle: string;

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

  contextMenuBg: string;
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
export type ModuleDefineThemeBlockSettings = {
  name: string;
  inheritanceParent: boolean;
};
export type ModuleDefineThemeBlockStyles = ModuleObject | ModuleDefineThemeBlockReturn;

export type ModuleDefineThemeBlockReturn = {
  id: string;
  type: 'defineThemeBlock';
  styles: ModuleDefineThemeBlockStyles[];
  settings: ModuleDefineThemeBlockSettings;
};
export type ModuleDefineThemeBlockRootReturn = {
  id: 'global';
  type: 'defineThemeBlockRoot';
  meta: ModuleDefineThemeMeta;
  styles: ModuleDefineThemeBlockStyles[];
};
