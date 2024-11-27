import type { ComputedRef } from 'vue';
import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleDefineThemeBlockSetting,
  ModuleThemeCleanedSetting,
  ModuleObject,
  ModuleOptionsExtend,
  ModuleStorage,
  ModuleThemeRootReturn,
  ModuleThemes,
  ModuleThemeType, ModuleDefineThemeMetaUI, ModuleDefineThemeMetaPreview
} from '../types';
// @ts-ignore
import connectorMeta from '../meta/connector';
import unwrap from '../helpers/unwrap';
import defineChecker from '../helpers/defineChecker';
import getSystemTheme from '../helpers/getSystemTheme';
import { Sandbox } from './Sandbox';
import { useRuntimeConfig, reactive, ref, computed, watch } from '#imports';

const DEFAULT_PREVIEW_STYLES: Required<ModuleDefineThemeMetaPreview> = {
  defaultPreviewCardBG1: '#FFFFFF',
  defaultPreviewCardBG2: '#CCCCCC',
  defaultPreviewCardBG3: '#999999',
  defaultPreviewCardBG4: '#666666',
  defaultPreviewCardBG5: '#333333',
  defaultPreviewCardBG6: '#000000'
};
const DEFAULT_UI_STYLES: Required<ModuleDefineThemeMetaUI> = {
  bg: '#fff',
  bgHover: '#f6f6f6',
  bgHeader: '#f6f6f6',
  bgBlockHeader: '#f6f6f6',
  bgGlass: 'rgba(0, 0, 0, 0.1)',
  blurGlass: '3px',
  shadow: 'rgba(0, 0, 0, 0.1)',
  border: 'rgba(0, 0, 0, 0.1)',

  inputFocus: '#333',
  inputBg: '#fff',
  inputRequired: '#ef0000',
  inputTitle: '#333',
  inputText: '#333',
  inputPlaceholder: '#999',

  title: '#333',
  titleTransparent: '#999',
  statusActiveBg: '#85f585',
  statusActiveTitle: '#245024',
  statusLightDarkBg: '#dab6e2',
  statusLightDarkTitle: '#3b003d',
  statusLightBg: '#ffd9a6',
  statusLightTitle: '#5f3700',
  statusDarkBg: '#9e9eff',
  statusDarkTitle: '#fff',
  contextMenuStatusActive: '#00ca00'
};

export class Client {
  private readonly config = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  private readonly sandbox = new Sandbox(this);
  private readonly usesScopesProperties = reactive<ModuleObject<ModuleObject>>({});

  private readonly isUseSystemTheme = ref(false);
  private readonly selectedThemeId = ref<string>();
  private readonly selectedLightThemeId = ref<string>();
  private readonly selectedDarkThemeId = ref<string>();
  private readonly selectedSystemThemeId = getSystemTheme().theme;
  private readonly themes = reactive<ModuleThemes>({});

  private readonly selectedTheme = computed(() => {
    const selectedTheme = unwrap.get(this.isUseSystemTheme) ? this._getSystemThemeAssociation() : unwrap.get(this.selectedThemeId);
    return selectedTheme ? this.themes[selectedTheme] : undefined;
  });

  private readonly savedStorage = computed<ModuleStorage>(() => ({
    isUseSystemTheme: unwrap.get(this.isUseSystemTheme),
    selectedThemeId: unwrap.get(this.selectedThemeId),
    selectedLightThemeId: unwrap.get(this.selectedLightThemeId),
    selectedDarkThemeId: unwrap.get(this.selectedDarkThemeId)
  }));

  constructor() {
    this._readSystemThemes();
    this._initDefaultThemes();
    this._readStorage();
    this._initWatchers();
  }

  private _readSystemThemes(): void {
    Object.keys(this.themes).forEach(key => delete this.themes[key]);
    Object.assign(this.themes, this.config.themes.reduce((accum, themeName) => {
      const theme = (connectorMeta as any)[`THEME_${themeName}`] as ModuleDefineThemeBlockRootReturn;

      return {
        ...accum,
        [themeName]: this._prepareTheme(theme, themeName, 'system')
      };
    }, {}));
  }

  private _initDefaultThemes(): void {
    unwrap.set(this, 'selectedLightThemeId', this._checkThemeAvailableAndGetActual(this.config.defaultTheme));
    unwrap.set(this, 'selectedDarkThemeId', this._checkThemeAvailableAndGetActual(this.config.defaultDarkTheme));
    unwrap.set(this, 'selectedThemeId', unwrap.get(this.selectedLightThemeId));
  }

  private _readStorage(): void {
    const storage = JSON.parse(localStorage.getItem(this.config.keys.storage) as string) as ModuleStorage | null;

    if (storage) {
      unwrap.set(this, 'selectedLightThemeId', this._checkThemeAvailableAndGetActual(storage.selectedLightThemeId, 'light'));
      unwrap.set(this, 'selectedDarkThemeId', this._checkThemeAvailableAndGetActual(storage.selectedDarkThemeId, 'dark'));
      this.setAutoModeTheme(storage.isUseSystemTheme);
      unwrap.set(this, 'selectedThemeId', this._checkThemeAvailableAndGetActual(storage.selectedThemeId, unwrap.get(this.isUseSystemTheme) ? 'system' : unwrap.get(this.selectedLightThemeId)));
    }
  }

  private _initWatchers(): void {
    const rootStylesKey = ':root';
    const uiStylesKey = `#${this.config.keys.sandbox.replaceAll(':', '\\:')}, #${this.config.keys.editor.replaceAll(':', '\\:')}`;

    watch(this.selectedTheme, (theme) => {
      this._appendStyleToHead(`${this.config.keys.style}:root`, theme ? { [rootStylesKey]: theme.styles[0].styles[0] as ModuleObject } : {});
      this._appendStyleToHead(`${this.config.keys.style}:ui`, { [uiStylesKey]: { ...DEFAULT_UI_STYLES, ...theme?.meta.uiStyles } });
    }, { immediate: true });

    watch(this.usesScopesProperties, scopes => this._appendStyleToHead(`${this.config.keys.style}:scope`, scopes, true), { immediate: true });

    watch(this.themes, (themes) => {
      this._appendStyleToHead(
        `${this.config.keys.style}:preview`,
        Object
          .values(themes)
          .reduce((accum, theme) => ({
            ...accum,
            [`theme-${theme.id}-preview`]: {
              ...DEFAULT_PREVIEW_STYLES,
              ...theme.meta.previewStyles
            }
          }), {}), true);
    }, { immediate: true });

    watch(this.savedStorage, () => this._saveStorage());
  }

  private _prepareTheme(themeFile: ModuleDefineThemeBlockRootReturn, themeName: string, themeType: ModuleThemeType): ModuleThemeRootReturn {
    const cleanThemeStyles = (themeStyle: ModuleDefineThemeBlockSetting, selfId?: string): ModuleThemeCleanedSetting => {
      if (defineChecker(themeStyle, 'block')) return {
        id: themeStyle.id,
        styles: (themeStyle.styles as ModuleDefineThemeBlockSetting[]).map(style => cleanThemeStyles(style))
      };
      if (selfId) return {
        id: selfId,
        styles: [themeStyle]
      };

      return themeStyle;
    };

    return {
      id: themeName,
      name: themeFile.meta.name ?? themeName,
      type: themeType,
      meta: {
        name: themeName,
        description: '',

        ...themeFile.meta,

        previewStyles: themeFile.meta.previewStyles!,
        uiStyles: themeFile.meta.uiStyles!
      },
      styles: themeFile.styles.map(style => cleanThemeStyles(style, 'global'))
    };
  }

  private _checkThemeAvailableAndGetActual(themeName?: string, def?: 'light' | 'dark' | 'system' | string): string | undefined {
    const isInThemes = themeName && themeName in this.themes;

    if (isInThemes) return themeName;
    else if (def === 'light') return this._checkThemeAvailableAndGetActual(this.config.defaultTheme);
    else if (def === 'dark') return this._checkThemeAvailableAndGetActual(this.config.defaultDarkTheme);
    else if (def === 'system') return this._getSystemThemeAssociation();
    else if (def) return this._checkThemeAvailableAndGetActual(def);
    else return undefined;
  }

  private _appendStyleToHead(id: string, scopes: ModuleObject<ModuleObject>, shielding = false) {
    const styleContent = Object.keys(scopes).map((scopeId) => {
      const scopeStyles = scopes[scopeId];
      return [
        shielding ? `[${scopeId}] {` : `${scopeId} {`,
        ...Object.keys(scopeStyles).map(key => `  --${key}: ${scopeStyles[key]};`),
        '}'
      ].join('\n');
    }).join('\n\n');

    const _styleElement = document.getElementById(id);
    const styleElement = _styleElement ?? document.createElement('style');
    styleElement.id = id;
    styleElement.textContent = styleContent;
    if (!_styleElement) document.head.appendChild(styleElement);
  }

  private _saveStorage(): void {
    localStorage.setItem(this.config.keys.storage, JSON.stringify(unwrap.get(this.savedStorage)));
  }

  private _getSystemThemeAssociation(): string {
    switch (unwrap.get(this.selectedSystemThemeId)) {
      case 'light':
        return this._checkThemeAvailableAndGetActual(unwrap.get(this.selectedLightThemeId), 'light')!;
      case 'dark':
        return this._checkThemeAvailableAndGetActual(unwrap.get(this.selectedDarkThemeId), 'dark')!;
    }
  }

  registerScopeStyles(scopeId: string, styles: ComputedRef<ModuleObject>): void {
    (this.usesScopesProperties as ModuleObject<any>)[scopeId] = styles;
  }

  unregisterScopeStyles(scopeId: string): void {
    delete this.usesScopesProperties[scopeId];
  }

  checkScopeRegistration(scopeId: string): boolean {
    return !!this.usesScopesProperties[scopeId];
  }

  getStylesByPath(blockPath: string): ComputedRef<ModuleObject> {
    const searchDefineStylesByPath = (blockName: string[], styles?: ModuleThemeCleanedSetting[]): ModuleObject => {
      if (styles) {
        for (const style of styles) {
          if (style.id && Array.isArray(style.styles)) {
            if (style.id === blockName[0]) {
              return searchDefineStylesByPath(blockName.slice(1), style.styles);
            }
          } else if (!blockName.length) {
            return style as ModuleObject;
          }
        }
      }

      return {};
    };

    return computed(() => searchDefineStylesByPath(blockPath.split('.'), unwrap.get(this.selectedTheme)?.styles));
  }

  getConfig(): ModuleOptionsExtend {
    return this.config;
  }

  getSandbox(): Sandbox {
    return this.sandbox;
  }

  getThemes(): ModuleThemes {
    return this.themes;
  }

  getSelectedTheme(): ModuleThemeRootReturn | undefined {
    return unwrap.get(this.selectedTheme);
  }

  getSelectedThemeId(): string | undefined {
    return unwrap.get(this.selectedThemeId);
  }

  getSelectedLightThemeId(): string | undefined {
    return unwrap.get(this.selectedLightThemeId);
  }

  getSelectedDarkThemeId(): string | undefined {
    return unwrap.get(this.selectedDarkThemeId);
  }

  getAutoModeStatus(): boolean {
    return unwrap.get(this.isUseSystemTheme);
  }

  setAutoModeTheme(mode: boolean): void {
    if (!unwrap.get(this.selectedDarkThemeId)) return;
    unwrap.set(this, 'isUseSystemTheme', mode);
  }

  selectTheme(themeName: string): void {
    if (!(themeName in this.themes) || unwrap.get(this.selectedThemeId) === themeName) return;
    unwrap.set(this, 'isUseSystemTheme', false);
    unwrap.set(this, 'selectedThemeId', themeName);
  }

  selectLightTheme(themeName: string): void {
    if (!(themeName in this.themes) || unwrap.get(this.selectedLightThemeId) === themeName) return;
    unwrap.set(this, 'selectedLightThemeId', themeName);
  }

  selectDarkTheme(themeName: string): void {
    if (!(themeName in this.themes) || unwrap.get(this.selectedDarkThemeId) === themeName) return;
    unwrap.set(this, 'selectedDarkThemeId', themeName);
  }
}
