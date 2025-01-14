import type { ComputedRef } from 'vue';
import type { Ref } from '@vue/reactivity';
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
  ModuleDefaultBlockKeys,
  ModuleThemeCreateData,
  ModuleThemeEditData,
  ModuleErrorMessage,
  ModuleErrorType,
  ModulePagesNames, ModuleThemeScopes, ModuleThemeScopesStyles, ModuleDefineThemeMetaPreview, ModuleDefineThemeMetaUI
} from '../../types';
// @ts-ignore
import connectorMeta from '../../meta/connector';
import { DEFAULT_PREVIEW_STYLES, DEFAULT_UI_STYLES } from '../../assets/defaultStyles';
import unwrap from '../../helpers/client/unwrap';
import useSystemTheme from '../../helpers/client/useSystemTheme';
import defineChecker from '../../helpers/defineChecker';
import useReloadMiddleware from '../../helpers/client/useReloadMiddleware';
import mergeThemes from '../../helpers/mergeThemes';
import useIdProtect from '../../helpers/client/useIdProtect';
import { Sandbox } from './Sandbox';
import { Router } from './Router';
import { useRuntimeConfig, reactive, ref, computed, watch } from '#imports';

type ThemeId = string | Ref<string | undefined>;
type ThemeDefConfig = 'light' | 'dark' | 'system' | ThemeId | undefined;

export class Client {
  private readonly runtimeUIId = useIdProtect('ui');
  private readonly runtimePreviewId = useIdProtect('preview');
  private readonly runtimeSelectedId = useIdProtect('selected');

  private readonly config = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  private readonly reloadMiddleware = useReloadMiddleware();
  private readonly sandbox = new Sandbox(this);
  private readonly router = new Router(this);

  private readonly themesPathsCache: ModuleObject<(number | string)[]> = reactive({});
  private readonly errorsMessages = reactive<ModuleErrorMessage[]>([]);
  private readonly usesScopesProperties = reactive<ModuleThemeScopes>({});

  private readonly isAutoThemeMode = ref(false);
  private readonly selectedSelfThemeId = ref<string>();
  private readonly selectedLightThemeId = ref<string>();
  private readonly selectedDarkThemeId = ref<string>();
  private readonly selectedSystemThemeId = useSystemTheme().theme;
  private readonly themes = reactive<ModuleThemes>({});

  private readonly editedTheme = ref<ModuleThemeRootReturn>();
  private readonly editedThemeId = computed(() => this.editedTheme.value?.id);

  private readonly selectedThemeId = computed(() => unwrap.get(this.isAutoThemeMode) ? this._getSystemThemeAssociation() : unwrap.get(this.selectedSelfThemeId));
  private readonly selectedTheme = computed(() => {
    const themeId = unwrap.get(this.selectedThemeId);
    const editedTheme = unwrap.get(this.editedTheme);
    return editedTheme ? this._prepareSelectedTheme(editedTheme) : themeId ? this._prepareSelectedTheme(this.themes[themeId]) : undefined;
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
    this._createThemesPaths();
    this._selectDefaultThemes();
    this._readStorage();
    this._initWatchers();
  }

  private _initWatchers(): void {
    const rootStylesKey = ':root';
    const uiStylesKey = `#${this.config.keys.sandbox.replaceAll(':', '\\:')}, #${this.config.keys.editor.replaceAll(':', '\\:')}`;

    watch(this.selectedTheme, (theme) => {
      this._appendStyleToHead(`${this.config.keys.style}:root`, theme ? { [rootStylesKey]: (theme as any).styles[0].styles[0] } : {});
      this._appendStyleToHead(`${this.config.keys.style}:preview`, { [`[theme-${useIdProtect('selected')}-preview]`]: unwrap.get(this.getSelectedStylesPreview()) });
      this._appendStyleToHead(`${this.config.keys.style}:ui`, { [uiStylesKey]: unwrap.get(this.getSelectedStylesUI()) });
    }, { immediate: true });

    watch(this.usesScopesProperties, properties => this._appendStyleToHead(
      `${this.config.keys.style}:scope`,
      Object.values(properties).reduce((acc, property) => ({ ...acc, [property.scopesIds.map(scopeId => `[${scopeId}]`).join(',\n')]: property.styles }), {})
    ), { immediate: true });

    watch(this.themes, (themes) => {
      this._appendStyleToHead(
        `${this.config.keys.style}:preview:all`,
        {
          [`[theme-${useIdProtect('default')}-preview]`]: DEFAULT_PREVIEW_STYLES,
          ...Object.values(themes).reduce((acc, theme) => ({ ...acc, [`[theme-${theme.id}-preview]`]: unwrap.get(this.getSelectedStylesPreview(theme)) }), {})
        }
      );
    }, { immediate: true });

    // watch(this.editedThemeId, themeId => this.reloadMiddleware[themeId ? 'on' : 'off']());

    watch(this.savedStorage, () => this._saveStorage());
  }

  private _readSystemThemes(): void {
    const getConnectorTheme = (themeName: string) => (connectorMeta as any)[`THEME_${themeName}`] as ModuleDefineThemeBlockRootReturn;
    Object.keys(this.themes).forEach(key => delete this.themes[key]);

    const defaultThemeName = this.config.defaultTheme;
    const defaultTheme = this._buildSystemTheme(getConnectorTheme(defaultThemeName), defaultThemeName, 'system');

    Object.assign(this.themes, {
      [defaultThemeName]: defaultTheme,
      ...this.config.themes
        .filter(themeName => themeName !== defaultThemeName)
        .reduce((accum, themeName) => ({
          ...accum,
          [themeName]: mergeThemes(
            this._buildSystemTheme(getConnectorTheme(themeName), themeName, 'system'),
            JSON.parse(JSON.stringify(defaultTheme))
          )
        }), {})
    });
  }

  private _selectDefaultThemes(): void {
    this._replaceSelectedThemes(this.config.defaultTheme, this.config.defaultDarkTheme, this.selectedLightThemeId);
  }

  private _replaceSelectedThemes(light?: ThemeId, dark?: ThemeId, self?: ThemeId, lightDef?: ThemeId, darkDef?: ThemeId, selfDef?: ThemeId): void {
    unwrap.set(this, 'selectedLightThemeId', this._checkThemeAvailableAndGetActual(unwrap.get(light ?? this.selectedLightThemeId), lightDef, 'light'));
    unwrap.set(this, 'selectedDarkThemeId', this._checkThemeAvailableAndGetActual(unwrap.get(dark ?? this.selectedDarkThemeId), darkDef, 'dark'));
    unwrap.set(this, 'selectedSelfThemeId', this._checkThemeAvailableAndGetActual(unwrap.get(self ?? this.selectedSelfThemeId), selfDef, unwrap.get(this.isAutoThemeMode) ? 'system' : unwrap.get(this.selectedLightThemeId)));
  }

  private _readStorage(): void {
    const storage = JSON.parse(localStorage.getItem(this.config.keys.storage) as string) as ModuleStorage | null;

    if (storage) {
      Object.assign(this.themes, Object.values(storage.localThemes).map(this._buildCustomTheme.bind(this)).reduce((acc, theme) => ({ ...acc, [theme.id]: theme }), {}));
      unwrap.set(this, 'selectedLightThemeId', this._checkThemeAvailableAndGetActual(storage.selectedLightThemeId, 'light'));
      unwrap.set(this, 'selectedDarkThemeId', this._checkThemeAvailableAndGetActual(storage.selectedDarkThemeId, 'dark'));
      this.setAutoThemeModeStatus(storage.isAutoThemeMode);
      unwrap.set(this, 'selectedSelfThemeId', this._checkThemeAvailableAndGetActual(storage.selectedSelfThemeId, unwrap.get(this.isAutoThemeMode) ? 'system' : unwrap.get(this.selectedLightThemeId)));
    }
  }

  private _saveStorage(): void {
    localStorage.setItem(this.config.keys.storage, JSON.stringify(unwrap.get(this.savedStorage)));
  }

  private _buildCustomTheme(theme: ModuleThemeRootReturn, index: number): ModuleThemeRootReturn {
    theme = mergeThemes(theme, JSON.parse(JSON.stringify(this.themes[this.config.defaultTheme])));
    let themeId = theme.id;

    if (themeId in this.themes) {
      themeId = `${theme.id}-${(Date.now() + index).toFixed().slice(-4)}`;
      this.addError('WARN', 'index', `Used plug: ${theme.id} (${theme.name}) > ${themeId}`, 'ID duplicate detected!');
      theme.id = themeId;
    }

    return theme;
  }

  private _buildSystemTheme(themeFile: ModuleDefineThemeBlockRootReturn, themeId: string, themeType: ModuleThemeType): ModuleThemeRootReturn {
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
      id: themeId,
      name: themeFile.meta.name ?? themeId,
      description: themeFile.meta.description ?? '',
      type: themeType,
      styles: [
        ...themeFile.styles.map(style => cleanThemeStyles(style, 'global')),
        {
          id: useIdProtect('ui'),
          styles: [{
            ...DEFAULT_UI_STYLES,
            ...themeFile.meta.uiStyles
          }]
        },
        {
          id: useIdProtect('preview'),
          styles: [{
            ...DEFAULT_PREVIEW_STYLES,
            ...themeFile.meta.previewStyles
          }]
        }
      ]
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

  private _checkThemeAvailableAndGetActual(themeId?: ThemeId, ...def: ThemeDefConfig[]): string | undefined {
    const unwrapThemeId = unwrap.get(themeId);
    const unwrapDef = def.map(unwrap.get).filter(Boolean);
    const isInThemes = unwrapThemeId && unwrapThemeId in this.themes;
    const currentDef = unwrapDef[0];
    const lostDef = unwrapDef.slice(1);

    if (isInThemes) return unwrapThemeId;
    else if (currentDef === 'light') return this._checkThemeAvailableAndGetActual(this.config.defaultTheme);
    else if (currentDef === 'dark') return this._checkThemeAvailableAndGetActual(this.config.defaultDarkTheme);
    else if (currentDef === 'system') return this._getSystemThemeAssociation();
    else if (currentDef) return this._checkThemeAvailableAndGetActual(currentDef, ...lostDef);
    else return undefined;
  }

  private _appendStyleToHead(id: string, scopes: ModuleObject<ModuleThemeScopesStyles>) {
    const styleContent = Object.keys(scopes).map((scopeId) => {
      const scopeStyles = scopes[scopeId];
      return [
        `${scopeId} {`,
        ...Object.keys(scopeStyles).map(key => `  --${key}: ${unwrap.get(scopeStyles)[key]};`),
        '}'
      ].join('\n');
    }).join('\n\n');

    const _styleElement = document.getElementById(id) as HTMLStyleElement | null;
    const styleElement = _styleElement ?? document.createElement('style');
    styleElement.id = id;
    styleElement.type = 'text/css';
    styleElement.textContent = styleContent;
    if (!_styleElement) document.head.appendChild(styleElement);
  }

  private _getSystemThemeAssociation(): string {
    switch (unwrap.get(this.selectedSystemThemeId)) {
      case 'light':
        return this._checkThemeAvailableAndGetActual(unwrap.get(this.selectedLightThemeId), 'light')!;
      case 'dark':
        return this._checkThemeAvailableAndGetActual(unwrap.get(this.selectedDarkThemeId), 'dark')!;
    }
  }

  private _createThemesPaths(): void {
    const finder = (styles?: ModuleThemeSelectedStyles[], ctx: [string, number | string][] = []) => {
      const results: ModuleObject<(number | string)[]> = {};

      if (styles) {
        for (let styleIndex = 0; styleIndex < styles.length; ++styleIndex) {
          const stylesBlock = styles[styleIndex];

          if (stylesBlock.id) {
            Object.assign(results, finder(stylesBlock.styles as any, [...ctx, [stylesBlock.id, styleIndex]]));
          } else {
            const ctxKeys = ctx.map(block => block[0]);
            const ctxIndexes = ctx.map(block => block[1]);

            Object.assign(results, {
              ...{ [['B', ...ctxKeys].join('.')]: [...ctxIndexes, 0] },
              ...Object.keys(stylesBlock).reduce((acc, key) => ({
                ...acc,
                [['S', ...ctxKeys, key].join('.')]: [...ctxIndexes, 0, key]
              }), {})
            });
          }
        }
      }

      return results;
    };

    Object.assign(this.themesPathsCache, finder(this.themes[this.config.defaultTheme].styles));
  }

  private _getValueByThemesCache(type: 'B' | 'S', blockPath: string, styles?: ModuleThemeSelectedStyles[]): ModuleObject | string | undefined {
    const fullBlockPath = `${type}.${blockPath}`;

    if (styles && fullBlockPath in this.themesPathsCache) {
      return this.themesPathsCache[fullBlockPath].reduce((acc, index) => acc?.styles?.[index] ?? acc?.[index], { styles } as any);
    }
  }

  getStylesByPath(blockPath: ModuleDefaultBlockKeys, theme?: ModuleThemeRootReturn): ComputedRef<ModuleObject> {
    return computed(() => this._getValueByThemesCache('B', blockPath, (theme ?? unwrap.get(this.selectedTheme))?.styles) as any ?? {});
  }

  getStylesKeyValueByPath(stylePath: ModuleDefaultStyleKeys, theme?: ModuleThemeRootReturn): ComputedRef<string> {
    return computed(() => this._getValueByThemesCache('S', stylePath, (theme ?? unwrap.get(this.selectedTheme))?.styles) as any ?? 'UNKNOWN STYLE');
  }

  getSelectedStyles(theme?: ModuleThemeRootReturn): ComputedRef<ModuleThemeCleanedSetting[]> {
    return computed(() => (theme ?? this.selectedTheme.value)?.styles.filter(block => !block.id.startsWith(this.config.systemUUID.toString())) ?? []);
  }

  getSelectedStylesUI(theme?: ModuleThemeRootReturn): ComputedRef<ModuleDefineThemeMetaUI> {
    return this.getStylesByPath(this.runtimeUIId as any, theme);
  }

  getSelectedStylesPreview(theme?: ModuleThemeRootReturn): ComputedRef<ModuleDefineThemeMetaPreview> {
    return this.getStylesByPath(this.runtimePreviewId as any, theme);
  }

  registerScopeStyles(scopeId: string, blockPath: ModuleDefaultBlockKeys, styles: ComputedRef<ModuleObject>): void {
    const blockPathStyles = this.usesScopesProperties[blockPath];

    if (blockPathStyles) {
      if (!blockPathStyles.scopesIds.includes(scopeId)) {
        blockPathStyles.scopesIds.push(scopeId);
      }
    } else {
      this.usesScopesProperties[blockPath] = {
        scopesIds: [scopeId],
        styles
      };
    }
  }

  unregisterScopeStyles(scopeId: string, blockPath: ModuleDefaultBlockKeys): void {
    const blockPathStyles = this.usesScopesProperties[blockPath];

    if (blockPathStyles) {
      const scopeIdIndex = blockPathStyles.scopesIds.indexOf(scopeId);

      if (scopeIdIndex !== -1) blockPathStyles.scopesIds.splice(scopeIdIndex, 1);
      if (blockPathStyles.scopesIds.length === 0) delete this.usesScopesProperties[blockPath];
    }
  }

  checkScopeRegistration(scopeId: string, blockPath: ModuleDefaultBlockKeys): boolean {
    return !!this.usesScopesProperties[blockPath]?.scopesIds.includes(scopeId);
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

  getEditedTheme(): ModuleThemeRootReturn | undefined {
    return unwrap.get(this.editedTheme);
  }

  getThemesBlocksPaths(): ComputedRef<ModuleDefaultBlockKeys[]> {
    return computed(() =>
      Object.keys(this.themesPathsCache)
        .filter(path => path.startsWith('B') && !path.startsWith(`B.${this.config.systemUUID}`))
        .map(path => path.slice(2))
    ) as any;
  }

  getThemesStylesPaths(): ComputedRef<ModuleDefaultStyleKeys[]> {
    return computed(() =>
      Object.keys(this.themesPathsCache)
        .filter(path => path.startsWith('S') && !path.startsWith(`S.${this.config.systemUUID}`))
        .map(path => path.slice(2))
    ) as any;
  }

  getErrors(type?: ModuleErrorType, page?: ModulePagesNames): ModuleErrorMessage[] {
    return this.errorsMessages.filter(error => (type ? error.type === type : true) && (page ? error.page === page : true));
  }

  addError(type: ModuleErrorType, page: ModulePagesNames, message: string, title?: string): number {
    const id = Math.max(...this.errorsMessages.map(error => error.id), 0) + 1;
    this.errorsMessages.push({
      id,
      type,
      page,
      message,
      title
    });
    return id;
  }

  deleteError(id: number): void {
    const errorIndex = this.errorsMessages.findIndex(error => error.id === id);
    if (errorIndex !== -1) this.errorsMessages.splice(errorIndex, 1);
  }

  setThemeStyleValue(stylePath: ModuleDefaultStyleKeys, newValue: string, theme?: ModuleThemeRootReturn): void {
    const styles = theme?.styles ?? unwrap.get(this.selectedTheme)?.styles;
    const cache = this.themesPathsCache[`S.${stylePath}`];

    if (styles && cache) {
      cache.reduce((acc, index, i) => {
        if (cache.length > i + 1) {
          return acc?.styles?.[index];
        } else {
          acc[index] = newValue;
          return acc;
        }
      }, { styles } as any);
    }
  }

  setAutoThemeModeStatus(mode: boolean): void {
    if (!unwrap.get(this.selectedDarkThemeId)) return;
    unwrap.set(this, 'isAutoThemeMode', mode);
  }

  setLightTheme(id: string): void {
    if (!(id in this.themes) || unwrap.get(this.selectedLightThemeId) === id) return;
    unwrap.set(this, 'selectedLightThemeId', id);
  }

  setDarkTheme(id: string): void {
    if (!(id in this.themes) || unwrap.get(this.selectedDarkThemeId) === id) return;
    unwrap.set(this, 'selectedDarkThemeId', id);
  }

  setTheme(id: string): void {
    if (!(id in this.themes) || unwrap.get(this.selectedThemeId) === id) return;
    unwrap.set(this, 'isAutoThemeMode', false);
    unwrap.set(this, 'selectedSelfThemeId', id);
  }

  setEditedTheme(id?: string): void {
    if (!id || !(id in this.themes)) unwrap.set(this, 'editedTheme', undefined);
    else unwrap.set(this, 'editedTheme', mergeThemes(
      JSON.parse(JSON.stringify(this.themes[id])),
      JSON.parse(JSON.stringify(this.themes[this.config.defaultTheme])))
    );
  }

  createTheme(data: ModuleThemeCreateData): void {
    const { id, name, description, parentThemeId: parentId } = data;
    if (id in this.themes || !parentId || !(parentId in this.themes)) return;

    const newTheme = JSON.parse(JSON.stringify(this.themes[parentId])) as ModuleThemeRootReturn;
    this.themes[id] = {
      ...newTheme,

      id,
      name: name || id,
      description,
      type: 'local'
    };
  }

  editThemeInfo(data: ModuleThemeEditData): void {
    const { id, name, description, oldThemeId } = data;
    if (!(oldThemeId in this.themes)) return;

    const theme = this.themes[oldThemeId];
    delete this.themes[oldThemeId];
    this.themes[id] = {
      ...theme,

      id,
      name: name || id,
      description
    };
    this._replaceSelectedThemes(undefined, undefined, undefined, id, id, id);
  }

  deleteTheme(id: string): void {
    const theme = this.themes[id];
    if (!theme || theme.type !== 'local') return;
    delete this.themes[id];
    this._replaceSelectedThemes();
  }

  getRuntimeUIId() {
    return this.runtimeUIId;
  }

  getRuntimePreviewId() {
    return this.runtimePreviewId;
  }

  getRuntimeSelectedId() {
    return this.runtimeSelectedId;
  }
}
