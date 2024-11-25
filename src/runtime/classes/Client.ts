import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleDefineThemeBlockSetting,
  ModuleThemeCleanedSetting,
  ModuleObject,
  ModuleOptionsExtend,
  ModuleStorage,
  ModuleThemeRootReturn,
  ModuleThemes,
  ModuleThemeType
} from '../types';
// @ts-ignore
import connectorMeta from '../meta/connector';
import unwrap from '../helpers/unwrap';
import defineChecker from '../helpers/defineChecker';
import getSystemTheme from '../helpers/getSystemTheme';
import { Sandbox } from './Sandbox';
import { useRuntimeConfig, reactive, ref, computed, watch } from '#imports';

export class Client {
  private readonly config = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  private readonly sandbox = new Sandbox(this);
  private readonly usesScopesProperties = reactive<ModuleObject<ModuleObject>>({});

  private readonly isUseSystemTheme = ref(false);
  private readonly selectedThemeName = ref(this.config.defaultTheme);
  private readonly selectedSystemThemeName = getSystemTheme().theme;
  private readonly themes = reactive<ModuleThemes>({});

  private readonly selectedTheme = computed(() => {
    const selectedTheme = unwrap.get(this.isUseSystemTheme) ? this._getSystemThemeAssociation() : unwrap.get(this.selectedThemeName);
    return selectedTheme && selectedTheme in this.themes ? this.themes[selectedTheme] : this.themes[this.config.defaultTheme];
  });

  private readonly savedStorage = computed<ModuleStorage>(() => ({
    selectedThemeName: unwrap.get(this.selectedThemeName),
    isUseSystemTheme: unwrap.get(this.isUseSystemTheme)
  }));

  constructor() {
    Object.assign(this.themes, this._readSystemThemes());
    this._readStorage();
    this._initWatchers();
  }

  private _initWatchers(): void {
    const rootStylesKey = ':root';
    const uiStylesKey = `#${this.config.keys.sandbox.replaceAll(':', '\\:')}, #${this.config.keys.editor.replaceAll(':', '\\:')}`;

    watch(this.selectedTheme, (theme) => {
      this._appendStyleToHead(`${this.config.keys.style}:root`, { [rootStylesKey]: theme.styles[0].styles[0] as ModuleObject });
      this._appendStyleToHead(`${this.config.keys.style}:ui`, { [uiStylesKey]: theme.meta.uiStyles });
    }, { immediate: true });

    watch(this.usesScopesProperties, scopes => this._appendStyleToHead(`${this.config.keys.style}:scope`, scopes, true), { immediate: true });

    watch(this.themes, themes => this._appendStyleToHead(`${this.config.keys.style}:preview`, Object.values(themes).reduce((accum, theme) => ({ ...accum, [`theme-${theme.name}-preview`]: theme.meta.previewStyles }), {}), true), { immediate: true });

    watch(this.savedStorage, () => this._saveStorage());
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
      name: themeName,
      type: themeType,
      meta: {
        description: '',

        ...themeFile.meta,

        previewStyles: {
          defaultPreviewCardBG1: '#FFFFFF',
          defaultPreviewCardBG2: '#CCCCCC',
          defaultPreviewCardBG3: '#999999',
          defaultPreviewCardBG4: '#666666',
          defaultPreviewCardBG5: '#333333',
          defaultPreviewCardBG6: '#000000',

          ...themeFile.meta.previewStyles
        },
        uiStyles: {
          bg: '#fff',
          bgHover: '#f6f6f6',
          bgHeader: '#f6f6f6',
          bgBlockHeader: '#f6f6f6',
          bgGlass: 'rgba(0, 0, 0, 0.1)',
          blurGlass: '3px',
          shadow: 'rgba(0, 0, 0, 0.1)',
          border: 'rgba(0, 0, 0, 0.1)',
          title: '#333',
          titleTransparent: '#999',
          statusActiveBg: '#85f585',
          statusActiveTitle: '#777',
          contextMenuStatusActive: '#00ca00',

          ...themeFile.meta.uiStyles
        }
      },
      styles: themeFile.styles.map(style => cleanThemeStyles(style, 'global'))
    };
  }

  private _readSystemThemes(): ModuleThemes {
    if (this.config.themes.length) {
      return this.config.themes.reduce((accum, themeName) => {
        const theme = (connectorMeta as any)[`THEME_${themeName}`] as ModuleDefineThemeBlockRootReturn;

        return {
          ...accum,
          [themeName]: this._prepareTheme(theme, themeName, 'system')
        };
      }, {});
    } else {
      return {};
    }
  }

  private _readStorage(): void {
    const storage = JSON.parse(localStorage.getItem(this.config.keys.storage) as string) as ModuleStorage | null;

    unwrap.set(this, 'selectedThemeName', storage && storage.selectedThemeName in this.themes
      ? storage.selectedThemeName
      : this.config.defaultTheme);

    if (storage) {
      unwrap.set(this, 'isUseSystemTheme', storage.isUseSystemTheme);
    }
  }

  private _saveStorage(): void {
    localStorage.setItem(this.config.keys.storage, JSON.stringify(unwrap.get(this.savedStorage)));
  }

  private _getSystemThemeAssociation(): string {
    if (!this.config.defaultDarkTheme) return unwrap.get(this.selectedThemeName);

    switch (unwrap.get(this.selectedSystemThemeName)) {
      case 'light':
        return this.config.defaultTheme;
      case 'dark':
        return this.config.defaultDarkTheme;
    }
  }

  getConfig() {
    return this.config;
  }

  getSandbox() {
    return this.sandbox;
  }

  getThemes() {
    return this.themes;
  }

  getSelectedTheme() {
    return unwrap.get(this.selectedTheme);
  }

  getAutoModeStatus() {
    return unwrap.get(this.isUseSystemTheme);
  }

  getSelectedThemeName() {
    return unwrap.get(this.selectedThemeName);
  }

  setAutoModeTheme(mode: boolean) {
    unwrap.set(this, 'isUseSystemTheme', mode);
  }

  selectTheme(themeName: string) {
    if (!(themeName in this.themes)) return;
    unwrap.set(this, 'isUseSystemTheme', false);
    unwrap.set(this, 'selectedThemeName', themeName);
  }

  registerScopeStyles(blockPath: string, scopeId: string) {
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

    (this.usesScopesProperties as any)[scopeId] = computed(() => searchDefineStylesByPath(blockPath.split('.'), unwrap.get(this.selectedTheme)?.styles));
  }

  unregisterScopeStyles(scopeId: string) {
    delete this.usesScopesProperties[scopeId];
  }

  checkScopeRegistration(scopeId: string) {
    return !!this.usesScopesProperties[scopeId];
  }
}
