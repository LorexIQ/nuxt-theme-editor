import { type ComputedRef, watchEffect } from 'vue';
import type { Ref } from '@vue/reactivity';
import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleObject,
  ModuleOptionsExtend,
  ModuleStorage,
  ModuleThemes,
  ModuleThemeType,
  ModuleThemeSelectedStyles,
  ModuleDefaultStyleKeys,
  ModuleDefaultBlockKeys,
  ModuleThemeCreateData,
  ModuleErrorMessage,
  ModuleErrorType,
  ModulePagesNames,
  ModuleThemeScopes,
  ModuleThemeScopesStyles,
  ModuleTheme,
  ModuleThemeRef,
  ModuleThemeRAW,
  ModulePathsCache,
  ModuleDefineThemeBlockStyles,
  ModuleThemeCleanedStyles,
  ModuleDefineThemeBlockReturn
} from '../../types';
// @ts-ignore
import connectorMeta from '../../meta/connector';
import { DEFAULT_PREVIEW_STYLES, DEFAULT_UI_STYLES } from '../../assets/defaultStyles';
import unwrap from '../../helpers/client/unwrap';
import useSystemTheme from '../../helpers/client/useSystemTheme';
import defineChecker from '../../helpers/defineChecker';
import useReloadMiddleware from '../../helpers/client/useReloadMiddleware';
import useIdProtect from '../../helpers/client/useIdProtect';
import utils from '../../helpers/utils';
import { Theme } from '../../classes/client/Theme';
import useAPIFetch from '../../helpers/client/useAPIFetch';
import { Sandbox } from './Sandbox';
import { Router } from './Router';
import { useRuntimeConfig, reactive, ref, computed, watch } from '#imports';

type ThemeId = string | Ref<string | undefined>;
type ThemeDefConfig = 'light' | 'dark' | 'system' | ThemeId | undefined;
type ThemeSelectableType = 'main' | 'light' | 'dark' | 'edited';

export class Client {
  private readonly runtimeUIId = useIdProtect('ui');
  private readonly runtimePreviewId = useIdProtect('preview');
  private readonly runtimeDefaultId = useIdProtect('default');

  private readonly config = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  private readonly reloadMiddleware = useReloadMiddleware();
  private readonly sandbox = new Sandbox(this);
  private readonly router = new Router(this);

  private readonly themesPathsCache = reactive<ModulePathsCache>({});
  private readonly errorsMessages = reactive<ModuleErrorMessage[]>([]);
  private readonly usesScopesProperties = reactive<ModuleThemeScopes>({});

  private readonly isBlockVisible = ref(false);
  private readonly isAutoThemeMode = ref(false);
  private readonly selectedMainThemeId = computed(() => this.themes.find(theme => theme.isSelectedAsMain)?.id);
  private readonly selectedLightThemeId = computed(() => this.themes.find(theme => theme.isSelectedAsLight)?.id);
  private readonly selectedDarkThemeId = computed(() => this.themes.find(theme => theme.isSelectedAsDark)?.id);
  private readonly selectedEditedThemeId = computed(() => this.themes.find(theme => theme.isSelectedAsEdited)?.id);
  private readonly selectedThemeId = computed(() => unwrap.get(this.isAutoThemeMode) ? this._getSystemThemeAssociation() : unwrap.get(this.selectedMainThemeId));
  private readonly selectedSystemThemeId = useSystemTheme().theme;
  private readonly themes = reactive<ModuleThemeRef[]>([]);

  private readonly editedTheme = computed(() => this.getThemeById(unwrap.get(this.selectedEditedThemeId)));
  private readonly selectedTheme = computed(() => {
    const themeId = unwrap.get(this.selectedThemeId);
    const editedTheme = unwrap.get(this.editedTheme);
    return editedTheme ?? this.getThemeById(this._checkThemeAvailableAndGetActual(themeId, 'light'));
  });

  private readonly storageLocalThemes = computed(() => JSON.stringify(this.themes
    .filter(theme => theme.type === 'local')
    .map<ModuleThemeRAW>(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description,
      type: theme.type,
      styles: unwrap.get(theme.getStyles())
    }))));
  private readonly storageSettings = computed<ModuleStorage>(() => ({
    isAutoThemeMode: unwrap.get(this.isAutoThemeMode),
    localThemes: JSON.parse(unwrap.get(this.storageLocalThemes)),
    selectedMainThemeId: unwrap.get(this.selectedMainThemeId),
    selectedLightThemeId: unwrap.get(this.selectedLightThemeId),
    selectedDarkThemeId: unwrap.get(this.selectedDarkThemeId)
  }));

  constructor() {
    this._readSystemThemes();
    this._createThemesPaths();
    this._selectDefaultThemes();
    this._readStorage();
    this._initWatchers();

    this.loadGlobalThemes();
  }

  private _initWatchers(): void {
    const rootStylesKey = ':root';
    const uiStylesKey = `#${this.config.keys.sandbox.replaceAll(':', '\\:')}, #${this.config.keys.editor.replaceAll(':', '\\:')}`;

    watchEffect(() => {
      this._appendStyleToHead(
        `${this.config.keys.style}:preview`,
        {
          [`[theme-${this.runtimeDefaultId}-preview]`]: DEFAULT_PREVIEW_STYLES,
          ...this.themes.reduce((acc, theme) => ({
            ...acc,
            [`[theme-${theme.id}-preview]`]: unwrap.get(theme.getPrepareStylesPreview())
          }), {})
        }
      );
    });

    watchEffect(() => {
      this._appendStyleToHead(
        `${this.config.keys.style}:ui`,
        { [uiStylesKey]: unwrap.get(unwrap.get(this.selectedTheme)?.getPrepareStylesUI() ?? {}) }
      );
    });

    watchEffect(() => {
      this._appendStyleToHead(
        `${this.config.keys.style}:root`,
        { [rootStylesKey]: unwrap.get(unwrap.get(this.selectedTheme)?.getPreparedStylesBlock('global')) ?? {} }
      );
    });

    watchEffect(() => {
      this._appendStyleToHead(
        `${this.config.keys.style}:scope`,
        Object.values(this.usesScopesProperties).reduce((acc, property) => ({
          ...acc,
          [property.scopesIds.map(scopeId => `[${scopeId}]`).join(',\n')]: property.styles
        }), {})
      );
    });

    // watch(this.selectedEditedThemeId, themeId => this.reloadMiddleware[themeId ? 'on' : 'off']());

    watch(this.storageSettings, this._saveStorage.bind(this));
  }

  private _readSystemThemes(): void {
    const getConnectorTheme = (themeName: string) => (connectorMeta as any)[`THEME_${themeName}`] as ModuleDefineThemeBlockRootReturn;
    this.themes.splice(0);

    const defaultThemeName = this.config.defaultTheme;
    const defaultTheme = this._buildSystemTheme(getConnectorTheme(defaultThemeName), defaultThemeName, 'system');

    this.themes.push(
      reactive(defaultTheme),
      ...this.config.themes
        .filter(themeName => themeName !== defaultThemeName)
        .reduce<ModuleTheme[]>((accum, themeName) => {
          const buildTheme = this._buildSystemTheme(getConnectorTheme(themeName), themeName, 'system');
          buildTheme.setStyles(utils.mergeObjects(
            buildTheme.getStyles().value,
            defaultTheme.getStylesCopy().value
          ));

          return [
            ...accum,
            reactive(buildTheme)
          ];
        }, [])
    );
  }

  private _selectDefaultThemes(): void {
    this._replaceSelectedThemes(
      this.config.defaultTheme,
      this.config.defaultDarkTheme,
      undefined,
      undefined,
      undefined,
      this.config.defaultTheme
    );
  }

  private _replaceSelectedThemes(light?: ThemeId, dark?: ThemeId, main?: ThemeId, lightDef?: ThemeId, darkDef?: ThemeId, mainDef?: ThemeId): void {
    const lightId = this._checkThemeAvailableAndGetActual(unwrap.get(light ?? this.selectedLightThemeId), lightDef, 'light');
    const darkId = this._checkThemeAvailableAndGetActual(unwrap.get(dark ?? this.selectedDarkThemeId), darkDef, 'dark');
    const mainId = this._checkThemeAvailableAndGetActual(unwrap.get(main ?? this.selectedMainThemeId), mainDef, unwrap.get(this.isAutoThemeMode) ? 'system' : unwrap.get(this.selectedLightThemeId));

    this._selectThemeAs('light', lightId);
    this._selectThemeAs('dark', darkId);
    this._selectThemeAs('main', mainId);
  }

  private _readStorage(): void {
    const storage = JSON.parse(localStorage.getItem(this.config.keys.storage) as string) as ModuleStorage | null;

    if (storage) {
      const localThemes = storage.localThemes
        .filter(theme => !this.themes.find(loadedTheme => theme.id === loadedTheme.id))
        .map(this._buildCustomTheme.bind(this))
        .map(theme => reactive(theme));

      this.themes.push(...localThemes);
      this._replaceSelectedThemes(
        this._checkThemeAvailableAndGetActual(storage.selectedLightThemeId, 'light'),
        this._checkThemeAvailableAndGetActual(storage.selectedDarkThemeId, 'dark'),
        this._checkThemeAvailableAndGetActual(storage.selectedMainThemeId, unwrap.get(this.isAutoThemeMode) ? 'system' : unwrap.get(this.selectedLightThemeId))
      );
      this.setAutoThemeModeStatus(storage.isAutoThemeMode);
    }
  }

  private _saveStorage(): void {
    localStorage.setItem(this.config.keys.storage, JSON.stringify(unwrap.get(this.storageSettings)));
    console.log('Save');
  }

  private _buildCustomTheme(themeRAW: ModuleThemeRAW, index: number): ModuleThemeRef {
    const theme = new Theme(
      this,
      themeRAW.id,
      themeRAW.type,
      utils.mergeObjects(themeRAW.styles, utils.copyObject(unwrap.get(this.getThemeById(this.config.defaultTheme)!.getStyles().value))),
      themeRAW.name,
      themeRAW.description
    );

    let themeId = theme.id.value;
    if (themeId in this.themes) {
      themeId = `${themeId}-${(Date.now() + index).toFixed().slice(-4)}`;
      this.createError('WARN', 'index', `Used plug: ${theme.id.value} (${theme.name}) > ${themeId}`, 'ID duplicate detected!');
      theme.id.value = themeId;
    }

    return theme;
  }

  private _buildSystemTheme(file: ModuleDefineThemeBlockRootReturn, id: string, type: ModuleThemeType): ModuleThemeRef {
    const cleanThemeStyles = (themeStyle: ModuleDefineThemeBlockStyles, selfId?: string): ModuleThemeCleanedStyles => {
      const themeStyleTyped = themeStyle as ModuleDefineThemeBlockReturn;

      if (defineChecker(themeStyle, 'block')) return {
        id: themeStyleTyped.id,
        styles: themeStyleTyped.styles.map(style => cleanThemeStyles(style)),
        settings: themeStyleTyped.settings
      };
      if (selfId) return {
        id: selfId,
        styles: [themeStyleTyped],
        settings: themeStyleTyped.settings ?? {}
      };

      return themeStyle;
    };

    return new Theme(
      this,
      id,
      type,
      [
        ...file.styles.map(style => cleanThemeStyles(style, 'global')),
        {
          id: useIdProtect('ui'),
          styles: [{
            ...DEFAULT_UI_STYLES,
            ...file.meta.uiStyles
          }],
          settings: {
            name: 'UI',
            inheritanceParent: false
          }
        },
        {
          id: useIdProtect('preview'),
          styles: [{
            ...DEFAULT_PREVIEW_STYLES,
            ...file.meta.previewStyles
          }],
          settings: {
            name: 'Preview',
            inheritanceParent: false
          }
        }
      ],
      file.meta.name,
      file.meta.description
    );
  }

  private _checkThemeAvailableAndGetActual(themeId?: ThemeId, ...def: ThemeDefConfig[]): string | undefined {
    const unwrapThemeId = unwrap.get(themeId);
    const unwrapDef = def.map(unwrap.get).filter(Boolean);
    const isInThemes = unwrapThemeId && this.getThemeById(unwrapThemeId);
    const currentDef = unwrapDef[0];
    const lostDef = unwrapDef.slice(1);

    if (isInThemes) return unwrapThemeId;
    else if (currentDef === 'light') return this._checkThemeAvailableAndGetActual(this.config.defaultTheme);
    else if (currentDef === 'dark') return this._checkThemeAvailableAndGetActual(this.config.defaultDarkTheme);
    else if (currentDef === 'system') return this._getSystemThemeAssociation();
    else if (currentDef) return this._checkThemeAvailableAndGetActual(currentDef, ...lostDef);
    else return undefined;
  }

  private _getSystemThemeAssociation(): string {
    switch (unwrap.get(this.selectedSystemThemeId)) {
      case 'light':
        return this._checkThemeAvailableAndGetActual(unwrap.get(this.selectedLightThemeId), 'light')!;
      case 'dark':
        return this._checkThemeAvailableAndGetActual(unwrap.get(this.selectedDarkThemeId), 'dark')!;
    }
  }

  private _appendStyleToHead(id: string, scopes: ModuleObject<ModuleThemeScopesStyles>): void {
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

  private _createThemesPaths(): void {
    const finder = (styles?: ModuleThemeSelectedStyles[], ctx: [string, number | string][] = [], withInheritance = true) => {
      const results: ModuleObject<(number | string)[]> = {};

      if (styles) {
        for (let styleIndex = 0; styleIndex < styles.length; ++styleIndex) {
          const themeStyle = styles[styleIndex];

          if (themeStyle.id) {
            const themeStyleTyped = themeStyle as ModuleDefineThemeBlockReturn;
            Object.assign(results, finder(themeStyleTyped.styles, [...ctx, [themeStyle.id, styleIndex]], themeStyleTyped.settings.inheritanceParent));
          } else {
            const ctxKeys = ctx.map(block => block[0]);
            const ctxIndexes = ctx.map(block => block[1]);

            Object.assign(results, { [['B', ...ctxKeys].join('.')]: [Number(withInheritance), ...ctxIndexes, 0] });
            Object.assign(results, Object.keys(themeStyle).reduce((acc, key) => ({
              ...acc,
              [['S', ...ctxKeys, key].join('.')]: [0, ...ctxIndexes, 0, key]
            }), {}));
          }
        }
      }

      return results;
    };

    Object.assign(this.themesPathsCache, finder(this.getThemeById(this.config.defaultTheme)!.getStyles().value));
  }

  private _selectThemeAs(as: ThemeSelectableType, themeId?: string): void {
    const theme = this.getThemeById(themeId);
    const functionName = `setSelectedAs${as[0].toUpperCase() + as.slice(1)}`;

    if (theme) (theme as any)[functionName]();
    else this.unselectAllThemesAs(as);
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

  getThemes(): ModuleThemes {
    return this.themes;
  }

  getBlockStatus(): boolean {
    return unwrap.get(this.isBlockVisible);
  }

  getThemeById(id?: string): ModuleTheme | undefined {
    return this.themes.find(theme => theme.id === id);
  }

  getThemeIndexById(id: string): number {
    return this.themes.findIndex(theme => theme.id === id);
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

  getSelectedMainThemeId(): string | undefined {
    return unwrap.get(this.selectedMainThemeId);
  }

  getSelectedEditedThemeId(): string | undefined {
    return unwrap.get(this.selectedEditedThemeId);
  }

  getSelectedThemeId(): string | undefined {
    return unwrap.get(this.selectedThemeId);
  }

  getSelectedTheme(): ModuleTheme | undefined {
    return unwrap.get(this.selectedTheme);
  }

  getEditedTheme(): ModuleTheme | undefined {
    return unwrap.get(this.editedTheme);
  }

  getRuntimeUIId(): string {
    return this.runtimeUIId;
  }

  getRuntimePreviewId(): string {
    return this.runtimePreviewId;
  }

  getThemesPathsCache(): ModulePathsCache {
    return this.themesPathsCache;
  }

  getThemesPathsStyles(): ComputedRef<ModuleDefaultStyleKeys[]> {
    return computed(() =>
      Object.keys(this.themesPathsCache)
        .filter(path => path.startsWith('S') && !path.startsWith(`S.${this.config.systemUUID}`))
        .map(path => path.slice(2))
    );
  }

  getErrors(type?: ModuleErrorType, page?: ModulePagesNames): ModuleErrorMessage[] {
    return this.errorsMessages.filter(error => (type ? error.type === type : true) && (page ? error.page === page : true));
  }

  setBlockStatus(status: boolean): void {
    if (!status) {
      const editedThemeId = unwrap.get(this.selectedEditedThemeId);

      if (editedThemeId) {
        this.router.push(`editThemeStylesCancel?themeId=${editedThemeId}&withBlockClose=1`, 'tab-fade-lr');
        return;
      } else {
        this.router.push('index', 'tab-fade-lr');
      }
    }

    unwrap.set(this, 'isBlockVisible', status);
  }

  setAutoThemeModeStatus(mode: boolean): void {
    if (!unwrap.get(this.selectedDarkThemeId)) return;
    unwrap.set(this, 'isAutoThemeMode', mode);
  }

  setThemeSelectedAsLight(id: string): void {
    const theme = this.getThemeById(id);
    if (!theme || unwrap.get(this.selectedLightThemeId) === id) return;
    theme.setSelectedAsLight();
  }

  setThemeSelectedAsDark(id: string): void {
    const theme = this.getThemeById(id);
    if (!theme || unwrap.get(this.selectedDarkThemeId) === id) return;
    theme.setSelectedAsDark();
  }

  setThemeSelectedAsMain(id: string): void {
    const theme = this.getThemeById(id);
    if (!theme || unwrap.get(this.selectedThemeId) === id) return;
    unwrap.set(this, 'isAutoThemeMode', false);
    theme.setSelectedAsMain();
  }

  setThemeSelectedAsEdited(id?: string): void {
    const theme = this.getThemeById(id);
    if (!theme || unwrap.get(this.selectedEditedThemeId) === id) this.unselectAllThemesAs('edited');
    else theme.setSelectedAsEdited();
  }

  async loadGlobalThemes(): Promise<void> {
    this.themes
      .filter(theme => theme.type === 'global')
      .forEach(theme => this.themes.splice(this.themes.indexOf(theme), 1));

    try {
      const loadedThemes = await useAPIFetch('GET', '/', {});
      const preparedThemed = loadedThemes.map((theme, index) => reactive(this._buildCustomTheme({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        type: 'global',
        styles: JSON.parse(theme.stylesJSON)
      }, index)));
      this.themes.push(...preparedThemed);
    } catch {
      this.createError('ERROR', 'index', 'Wait and try downloading again. If there is this error, it is NOT RECOMMENDED to edit topics, these actions may lead to conflicts.', 'Error downloading themes from the server');
    }
  }

  createTheme(data: ModuleThemeCreateData): void {
    const { id, name, description, parentThemeId: parentId } = data;
    if (this.getThemeById(id) || !parentId || !this.getThemeById(parentId)) return;

    const newTheme = new Theme(
      this,
      id,
      'local',
      utils.copyObject(this.getThemeById(parentId)!.getStyles().value),
      name,
      description
    );
    this.themes.push(reactive(newTheme));
  }

  createError(type: ModuleErrorType, page: ModulePagesNames, message: string, title?: string): number {
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

  createScopeStyles(scopeId: string, blockPath: ModuleDefaultBlockKeys, styles: ComputedRef<ModuleObject>): void {
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

  deleteTheme(id: string): boolean {
    const theme = this.getThemeById(id);
    if (!theme || theme.type !== 'local') return false;

    this.themes.splice(this.getThemeIndexById(id), 1);
    this._replaceSelectedThemes();
    return true;
  }

  deleteError(id: number): void {
    const errorIndex = this.errorsMessages.findIndex(error => error.id === id);
    if (errorIndex !== -1) this.errorsMessages.splice(errorIndex, 1);
  }

  deleteScopeStyles(scopeId: string, blockPath: ModuleDefaultBlockKeys): void {
    const blockPathStyles = this.usesScopesProperties[blockPath];

    if (blockPathStyles) {
      const scopeIdIndex = blockPathStyles.scopesIds.indexOf(scopeId);

      if (scopeIdIndex !== -1) blockPathStyles.scopesIds.splice(scopeIdIndex, 1);
      if (blockPathStyles.scopesIds.length === 0) delete this.usesScopesProperties[blockPath];
    }
  }

  unselectAllThemesAs(as: ThemeSelectableType) {
    const functionName = `setSelectedAs${as[0].toUpperCase() + as.slice(1)}`;
    this.themes.forEach((theme: any) => theme[functionName](false));
  }

  checkScopeRegistration(scopeId: string, blockPath: ModuleDefaultBlockKeys): boolean {
    return !!this.usesScopesProperties[blockPath]?.scopesIds.includes(scopeId);
  }
}
