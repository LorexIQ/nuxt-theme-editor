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

  buttonBg: '#fafafa',
  buttonBgHover: '#fff',
  buttonBorder: '#00000019',
  buttonText: '#555',
  buttonTextHover: '#333',

  statusActiveBg: '#85f585',
  statusActiveTitle: '#245024',
  statusLightDarkBg: '#dab6e2',
  statusLightDarkTitle: '#3b003d',
  statusLightBg: '#ffd9a6',
  statusLightTitle: '#5f3700',
  statusDarkBg: '#9e9eff',
  statusDarkTitle: '#fff',

  contextMenuIcon: '#444',
  contextMenuIconActive: '#00ca00'
};
