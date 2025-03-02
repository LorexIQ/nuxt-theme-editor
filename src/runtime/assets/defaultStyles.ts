import type { ModuleDefineThemeMetaPreview, ModuleDefineThemeMetaUI } from '../types';

export const DEFAULT_PREVIEW_STYLES: Required<ModuleDefineThemeMetaPreview> = {
  bg1: '#FFFFFF',
  bg2: '#CCCCCC',
  bg3: '#999999',
  bg4: '#666666',
  bg5: '#333333',
  bg6: '#000000'
};

export const DEFAULT_UI_STYLES: Required<ModuleDefineThemeMetaUI> = {
  bg: '#fff',
  bgHover: '#fafafa',
  bgFooter: '#fff',
  bgBlockHeader: '#f6f6f6',
  bgThemeBlock: '#fff',
  bgAddThemeButton: '#fff',
  bgGlass: '#00000019',
  shadow: '#00000033',
  border: '#00000019',
  title: '#333',
  titleTransparent: '#999',

  headerBg: '#f6f6f6',
  headerTitle: '#333',
  headerButtonPopup: '#333',
  headerButtonClose: '#333',

  inputFocus: '#333',
  inputBg: '#fff',
  inputRequired: '#ef0000',
  inputTitle: '#333',
  inputText: '#333',
  inputPlaceholder: '#999',
  inputPostIcon: '#333',
  inputBorder: '#333',

  radioStatic: '#000',
  radioActive: '#2ecc71',

  switchSlider: '#999',
  switchSliderChecked: '#1e752a',
  switchSliderBorder: '#00000019',
  switchCircle: '#333',
  switchCircleChecked: '#2ecc71',
  switchCircleBorder: '#00000019',

  buttonDefaultBg: '#fafafa',
  buttonDefaultBgHover: '#fff',
  buttonDefaultBorder: '#00000019',
  buttonDefaultText: '#555',
  buttonDefaultTextHover: '#333',

  buttonSuccessBg: '#2ECC71CB',
  buttonSuccessBgHover: '#2ecc71',
  buttonSuccessBorder: '#00000019',
  buttonSuccessText: '#2C3E50CC',
  buttonSuccessTextHover: '#2c3e50',

  buttonErrorBg: '#FF5151E6',
  buttonErrorBgHover: '#ff5151',
  buttonErrorBorder: '#00000019',
  buttonErrorText: '#f5f5f5',
  buttonErrorTextHover: '#f5f5f5',

  statusActiveBg: '#2ecc71',
  statusActiveTitle: '#2c3e50',
  statusLightDarkBg: '#dab6e2',
  statusLightDarkTitle: '#3b003d',
  statusLightBg: '#ffd9a6',
  statusLightTitle: '#5f3700',
  statusDarkBg: '#9e9eff',
  statusDarkTitle: '#fff',
  statusCacheBg: '#ffbe6d',
  statusCacheTitle: '#fff',

  messageInfoBg: '#65758528',
  messageInfoTitle: '#333',
  messageInfoContent: '#333',
  messageTipBg: '#646CFF28',
  messageTipTitle: '#333',
  messageTipContent: '#333',
  messageWarnBg: '#EAB30828',
  messageWarnTitle: '#333',
  messageWarnContent: '#333',
  messageErrorBg: '#F43F5E28',
  messageErrorTitle: '#333',
  messageErrorContent: '#333',

  contextMenuBg: '#fff',
  contextMenuIcon: '#444',
  contextMenuIconSuccess: '#2ecc71',
  contextMenuIconError: '#ff5151',

  animationAlert: '#c0f0d4',
  animationCircular: '#f0c0c0'
};
