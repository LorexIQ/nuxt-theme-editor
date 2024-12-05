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
  ModuleThemeType,
  ModuleThemeSelected,
  ModuleThemeSelectedStyles,
  ModuleDefaultStyleKeys,
  ModuleDefaultBlockKeys, ModuleThemeCreateData, ModuleThemeEditData
} from '../../types';
// @ts-ignore
import connectorMeta from '../../meta/connector';
import unwrap from '../../helpers/unwrap';
import defineChecker from '../../helpers/defineChecker';
import getSystemTheme from '../../helpers/getSystemTheme';
import { DEFAULT_PREVIEW_STYLES, DEFAULT_UI_STYLES } from '../../assets/defaultStyles';
import { Sandbox } from './Sandbox';
import { Router } from './Router';
import { useRuntimeConfig, reactive, ref, computed, watch } from '#imports';

export class Client {
  private readonly config = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  private readonly sandbox = new Sandbox(this);
  private readonly router = new Router(this);

  private readonly themesPathsCache: ModuleObject<number[]> = {};
  private readonly usesScopesProperties = reactive<ModuleObject<ModuleObject>>({});

  private readonly isAutoThemeMode = ref(false);
  private readonly selectedSelfThemeId = ref<string>();
  private readonly selectedLightThemeId = ref<string>();
  private readonly selectedDarkThemeId = ref<string>();
  private readonly selectedSystemThemeId = getSystemTheme().theme;
  private readonly themes = reactive<ModuleThemes>({});

  private readonly selectedThemeId = computed(() => unwrap.get(this.isAutoThemeMode) ? this._getSystemThemeAssociation() : unwrap.get(this.selectedSelfThemeId));
  private readonly selectedTheme = computed(() => {
    const themeId = unwrap.get(this.selectedThemeId);
    return themeId ? this._prepareSelectedTheme(this.themes[themeId]) : undefined;
  });

  private readonly savedStorage = computed<ModuleStorage>(() => {
    const localThemes = Object.values(this.themes).filter(theme => theme.type === 'local').reduce((acc, theme) => ({ ...acc, [theme.id]: theme }), {});

    console.log('save');
    return {
      isAutoThemeMode: unwrap.get(this.isAutoThemeMode),
      localThemes: localThemes,
      selectedSelfThemeId: unwrap.get(this.selectedSelfThemeId),
      selectedLightThemeId: unwrap.get(this.selectedLightThemeId),
      selectedDarkThemeId: unwrap.get(this.selectedDarkThemeId)
    };
  });

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
        [themeName]: this._buildSystemTheme(theme, themeName, 'system')
      };
    }, {}));
  }

  private _initDefaultThemes(): void {
    unwrap.set(this, 'selectedLightThemeId', this._checkThemeAvailableAndGetActual(this.config.defaultTheme));
    unwrap.set(this, 'selectedDarkThemeId', this._checkThemeAvailableAndGetActual(this.config.defaultDarkTheme));
    unwrap.set(this, 'selectedSelfThemeId', unwrap.get(this.selectedLightThemeId));
  }

  private _readStorage(): void {
    const storage = JSON.parse(localStorage.getItem(this.config.keys.storage) as string) as ModuleStorage | null;

    if (storage) {
      Object.assign(this.themes, Object.values(storage.localThemes).map(this._themeValidate.bind(this)).reduce((acc, theme) => ({ ...acc, [theme.id]: theme }), {}));
      unwrap.set(this, 'selectedLightThemeId', this._checkThemeAvailableAndGetActual(storage.selectedLightThemeId, 'light'));
      unwrap.set(this, 'selectedDarkThemeId', this._checkThemeAvailableAndGetActual(storage.selectedDarkThemeId, 'dark'));
      this.setAutoThemeModeStatus(storage.isAutoThemeMode);
      unwrap.set(this, 'selectedSelfThemeId', this._checkThemeAvailableAndGetActual(storage.selectedSelfThemeId, unwrap.get(this.isAutoThemeMode) ? 'system' : unwrap.get(this.selectedLightThemeId)));
    }
  }

  private _themeValidate(theme: ModuleThemeRootReturn): ModuleThemeRootReturn {
    if (theme.id in this.themes) theme.id = `${theme.id}-${Date.now()}`;
    return theme;
  }

  private _initWatchers(): void {
    const rootStylesKey = ':root';
    const uiStylesKey = `#${this.config.keys.sandbox.replaceAll(':', '\\:')}, #${this.config.keys.editor.replaceAll(':', '\\:')}`;

    watch(this.selectedTheme, (theme) => {
      this._appendStyleToHead(`${this.config.keys.style}:root`, theme ? { [rootStylesKey]: (theme as any).styles[0].styles[0] } : {});
      this._appendStyleToHead(`${this.config.keys.style}:ui`, { [uiStylesKey]: { ...DEFAULT_UI_STYLES, ...theme?.meta.uiStyles } });
    }, { immediate: true });

    watch(this.usesScopesProperties, scopes => this._appendStyleToHead(`${this.config.keys.style}:scope`, scopes, true), { immediate: true });

    watch(this.themes, (themes) => {
      this._appendStyleToHead(
        `${this.config.keys.style}:preview`,
        {
          'theme-default-preview': DEFAULT_PREVIEW_STYLES,
          ...Object.values(themes).reduce((accum, theme) => ({ ...accum, [`theme-${theme.id}-preview`]: { ...DEFAULT_PREVIEW_STYLES, ...theme.meta.previewStyles } }), {})
        },
        true
      );
    }, { immediate: true });

    watch(this.savedStorage, () => this._saveStorage());
  }

  private _buildSystemTheme(themeFile: ModuleDefineThemeBlockRootReturn, themeName: string, themeType: ModuleThemeType): ModuleThemeRootReturn {
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

  private _prepareSelectedTheme(selectedTheme: ModuleThemeRootReturn): ModuleThemeSelected {
    const relationsPaths: ModuleObject = {};

    const isCircularRelation = (path1: string, path2: string): boolean => {
      let currentPath = relationsPaths[path2];

      while (currentPath) {
        if (currentPath === path1) return true;
        currentPath = relationsPaths[currentPath];
      }

      return false;
    };
    const getStyleByPath = (selfPath: string, styleValue: string): string => {
      if (styleValue.startsWith('$') && styleValue.length) {
        const relationPath = styleValue.slice(1);

        if (isCircularRelation(selfPath, relationPath)) {
          return 'CIRCULAR';
        } else {
          relationsPaths[selfPath] = relationPath;
          return getStyleByPath(relationPath, this.getStylesKeyValueByPath(relationPath as never, selectedTheme).value);
        }
      }
      return styleValue;
    };
    const prepareStyle = (stylesBlock: ModuleThemeCleanedSetting, parentPath: string[] = []): ModuleThemeSelectedStyles => {
      if (stylesBlock.id) return {
        id: stylesBlock.id,
        styles: (stylesBlock.styles as ModuleDefineThemeBlockSetting[]).map(style => prepareStyle(style, [...parentPath, stylesBlock.id]))
      };

      const stylesBlockAny = stylesBlock as any;
      for (const styleKey of Object.keys(stylesBlockAny)) {
        const styleValue = stylesBlockAny[styleKey] as string;
        const selfPath = [...parentPath, styleKey].join('.');
        stylesBlockAny[styleKey] = getStyleByPath(selfPath, styleValue);
      }

      return stylesBlockAny;
    };

    const themeCopy = JSON.parse(JSON.stringify(selectedTheme)) as ModuleThemeRootReturn;

    return {
      ...themeCopy,
      target: selectedTheme,
      styles: themeCopy.styles.map(style => prepareStyle(style))
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
        ...Object.keys(scopeStyles).map(key => `  --${key}: ${unwrap.get(scopeStyles[key])};`),
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

  private _searchBlockStylesByPath(stylesPath: string, styles?: ModuleThemeSelectedStyles[]): ModuleObject {
    const finder = (blocksIds: string[], styles?: ModuleThemeSelectedStyles[]): [ModuleObject, number[]] => {
      if (styles) {
        for (let styleIndex = 0; styleIndex < styles.length; ++styleIndex) {
          const style = styles[styleIndex];

          if (style.id && Array.isArray(style.styles)) {
            if (style.id === blocksIds[0]) {
              const childrenStyles = finder(blocksIds.slice(1), style.styles);
              return [childrenStyles[0], [styleIndex, ...childrenStyles[1]]];
            }
          } else if (!blocksIds.length) {
            return [style as ModuleObject, [styleIndex]];
          }
        }
      }

      return [{}, []];
    };

    if (!styles) {
      return {};
    } else if (this.themesPathsCache[stylesPath]) {
      return this.themesPathsCache[stylesPath].reduce((acc, index) => acc?.styles[index], { styles } as any) ?? {};
    } else {
      const findBlock = finder(stylesPath.split('.'), styles);
      this.themesPathsCache[stylesPath] = findBlock[1];
      return findBlock[0];
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

  getStylesKeyValueByPath(stylePath: ModuleDefaultStyleKeys, theme?: ModuleThemeRootReturn): ComputedRef<string> {
    const stylePathParts = (stylePath as string).split('.');
    const blockPath = stylePathParts.length > 1 ? stylePathParts.slice(0, -1).join('.') : '';
    const styleName = stylePathParts[stylePathParts.length - 1] as any;

    return computed(() => unwrap.get(this._searchBlockStylesByPath(blockPath, (theme ?? unwrap.get(this.selectedTheme))?.styles)[styleName]) ?? 'UNKNOWN STYLE');
  }

  getStylesByPath(blockPath: ModuleDefaultBlockKeys, theme?: ModuleThemeRootReturn): ComputedRef<ModuleObject> {
    return computed(() => this._searchBlockStylesByPath(blockPath, (theme ?? unwrap.get(this.selectedTheme))?.styles));
  }

  getConfig(): ModuleOptionsExtend {
    return this.config;
  }

  getSandbox(): Sandbox {
    return this.sandbox;
  }

  getRouter(): Router {
    return this.router;
  }

  getAutoThemeModeStatus(): boolean {
    return unwrap.get(this.isAutoThemeMode);
  }

  getSelectedLightThemeId(): string | undefined {
    return unwrap.get(this.selectedLightThemeId);
  }

  getSelectedDarkThemeId(): string | undefined {
    return unwrap.get(this.selectedDarkThemeId);
  }

  getSelectedSelfThemeId(): string | undefined {
    return unwrap.get(this.selectedSelfThemeId);
  }

  getThemes(): ModuleThemes {
    return this.themes;
  }

  getSelectedTheme(): ModuleThemeSelected | undefined {
    return unwrap.get(this.selectedTheme);
  }

  getSelectedThemeId(): string | undefined {
    return unwrap.get(this.selectedThemeId);
  }

  setAutoThemeModeStatus(mode: boolean): void {
    if (!unwrap.get(this.selectedDarkThemeId)) return;
    unwrap.set(this, 'isAutoThemeMode', mode);
  }

  setLightTheme(themeId: string): void {
    if (!(themeId in this.themes) || unwrap.get(this.selectedLightThemeId) === themeId) return;
    unwrap.set(this, 'selectedLightThemeId', themeId);
  }

  setDarkTheme(themeId: string): void {
    if (!(themeId in this.themes) || unwrap.get(this.selectedDarkThemeId) === themeId) return;
    unwrap.set(this, 'selectedDarkThemeId', themeId);
  }

  setTheme(themeId: string): void {
    if (!(themeId in this.themes) || unwrap.get(this.selectedThemeId) === themeId) return;
    unwrap.set(this, 'isAutoThemeMode', false);
    unwrap.set(this, 'selectedSelfThemeId', themeId);
  }

  createTheme(themeData: ModuleThemeCreateData): void {
    const { id, name, description, parentThemeId: parentId } = themeData;
    if (id in this.themes || !parentId || !(parentId in this.themes)) return;

    const newTheme = JSON.parse(JSON.stringify(this.themes[parentId])) as ModuleThemeRootReturn;
    this.themes[id] = {
      ...newTheme,

      id,
      name: name || id,
      type: 'local',
      meta: {
        ...newTheme.meta,

        name: name || id,
        description: description
      }
    };
  }

  editThemeInfo(themeData: ModuleThemeEditData): void {
    const { id, name, description, oldThemeId } = themeData;
    if (!(oldThemeId in this.themes)) return;

    const theme = this.themes[oldThemeId];
    delete this.themes[oldThemeId];
    this.themes[id] = {
      ...theme,

      id,
      name: name || id,
      meta: {
        ...theme.meta,

        name: name || id,
        description: description
      }
    };
  }

  deleteTheme(themeId: string): void {
    const theme = this.themes[themeId];
    if (!theme || theme.type !== 'local') return;
    delete this.themes[themeId];

    unwrap.set(this, 'selectedLightThemeId', this._checkThemeAvailableAndGetActual(unwrap.get(this.selectedLightThemeId), 'light'));
    unwrap.set(this, 'selectedDarkThemeId', this._checkThemeAvailableAndGetActual(unwrap.get(this.selectedDarkThemeId), 'dark'));
    unwrap.set(this, 'selectedSelfThemeId', this._checkThemeAvailableAndGetActual(unwrap.get(this.selectedSelfThemeId), unwrap.get(this.isAutoThemeMode) ? 'system' : unwrap.get(this.selectedLightThemeId)));
  }
}
