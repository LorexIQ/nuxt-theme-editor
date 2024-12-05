import type { ModuleDefineThemeMetaPreview, ModuleDefineThemeMetaUI } from '../types';

export const DEFAULT_PREVIEW_STYLES: Required<ModuleDefineThemeMetaPreview> = {
  defaultPreviewCardBG1: '#FFFFFF',
  defaultPreviewCardBG2: '#CCCCCC',
  defaultPreviewCardBG3: '#999999',
  defaultPreviewCardBG4: '#666666',
  defaultPreviewCardBG5: '#333333',
  defaultPreviewCardBG6: '#000000'
};

export const DEFAULT_UI_STYLES: Required<ModuleDefineThemeMetaUI> = {
  bg: '#fff',
  bgHover: '#f6f6f6',
  bgHeader: '#f6f6f6',
  bgFooter: '#fff',
  bgBlockHeader: '#f6f6f6',
  bgGlass: '#00000019',
  blurGlass: '3px',
  shadow: '#00000033',
  border: '#00000019',
  title: '#333',
  titleTransparent: '#999',

  inputFocus: '#333',
  inputBg: '#fff',
  inputRequired: '#ef0000',
  inputTitle: '#333',
  inputText: '#333',
  inputPlaceholder: '#999',

  radioStatic: '#000',
  radioActive: '#2ecc71',

  buttonDefaultBg: '#fafafa',
  buttonDefaultBgHover: '#fff',
  buttonDefaultBorder: '#00000019',
  buttonDefaultText: '#555',
  buttonDefaultTextHover: '#333',

  buttonGreenBg: '#2ECC71CB',
  buttonGreenBgHover: '#2ecc71',
  buttonGreenBorder: '#00000019',
  buttonGreenText: '#2C3E50CC',
  buttonGreenTextHover: '#2c3e50',

  statusActiveBg: '#2ecc71',
  statusActiveTitle: '#2c3e50',
  statusLightDarkBg: '#dab6e2',
  statusLightDarkTitle: '#3b003d',
  statusLightBg: '#ffd9a6',
  statusLightTitle: '#5f3700',
  statusDarkBg: '#9e9eff',
  statusDarkTitle: '#fff',

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

  contextMenuIcon: '#444',
  contextMenuIconActive: '#2ecc71'
};
