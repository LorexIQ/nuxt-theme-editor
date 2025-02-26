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
  ModuleDefineThemeBlockReturn,
  ModuleLocalStorageThemeMini,
  ModuleDefineThemeBlockSettings, ModuleEvBusClient, ModuleEvBusClientExtend, ModuleEvBusThemeExtend
} from '../../types';
// @ts-ignore
import connectorMeta from '../../meta/connector';
import { DEFAULT_PREVIEW_STYLES, DEFAULT_UI_STYLES } from '../../assets/defaultStyles';
import unwrap from '../../helpers/client/unwrap';
import useSystemTheme from '../../helpers/client/useSystemTheme';
import defineChecker from '../../helpers/defineChecker';
import useReloadMiddleware from '../../helpers/client/useReloadMiddleware';
import useIdProtect from '../../helpers/client/useIdProtect';
import useAPIFetch from '../../helpers/client/useAPIFetch';
import useConfig from '../../helpers/client/useConfig';
import utils from '../../helpers/utils';
import { Theme } from '../../classes/client/Theme';
import useLang from '../../helpers/client/useLang';
import { Sandbox } from './Sandbox';
import { Router } from './Router';
import { reactive, ref, computed, watch, useState } from '#imports';

type ThemeId = string | Ref<string | undefined>;
type ThemeDefConfig = 'light' | 'dark' | 'system' | ThemeId | undefined;
type ThemeSelectableType = 'main' | 'light' | 'dark' | 'edited';
type ThemeBlockStatus = 0 | 1 | 2;

export class Client {
  private readonly runtimeUIId = useIdProtect('ui');
  private readonly runtimePreviewId = useIdProtect('preview');
  private readonly runtimeDefaultId = useIdProtect('default');

  private readonly themesBlockSystemStatus = ref<ThemeBlockStatus>(0);
  private readonly themesBlockGlobalStatus = ref<ThemeBlockStatus>(0);
  private readonly themesBlockLocalStatus = ref<ThemeBlockStatus>(0);

  private readonly config = useConfig();
  private readonly configThemeSystem = this.config.themesConfig.system;
  private readonly configThemeGlobal = this.config.themesConfig.global;
  private readonly configThemeLocal = this.config.themesConfig.local;
  private readonly isGlobalThemesEnabled = this.configThemeGlobal.enabled;
  private readonly isLocalThemesEnabled = this.configThemeLocal.enabled;
  private readonly isEditingModeEnabled = computed(() => this.configThemeGlobal.editingAllowedUseStateKey ? useState<boolean>(this.configThemeGlobal.editingAllowedUseStateKey).value : true);

  private readonly reloadMiddleware = useReloadMiddleware();
  private readonly sandbox = new Sandbox(this);
  private readonly router = new Router(this);

  private readonly themesPathsCache = reactive<ModulePathsCache>({});
  private readonly errorsMessages = reactive<ModuleErrorMessage[]>([]);
  private readonly usesScopesProperties = reactive<ModuleThemeScopes>({});

  private readonly isPopupSelf = ref(window.opener !== null || window.name === 'popupWindow');
  private readonly isPopupActive = ref(false);
  private readonly popupWindowRef = ref<WindowProxy | null>(null);
  private readonly popupChannel = new BroadcastChannel('client_channel');

  private readonly isBlockVisible = ref(unwrap.get(this.isPopupSelf) || false);
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
      timestamp: theme.timestamp,
      type: theme.type,
      styles: unwrap.get(theme.getStyles())
    }))));
  private readonly storageGlobalThemesCache = computed(() => {
    return JSON.stringify(this.themes
      .filter(theme => theme.isInCache)
      .map<ModuleThemeRAW>(theme => ({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        timestamp: theme.timestamp,
        type: theme.type,
        styles: unwrap.get(theme.getStyles())
      })));
  });
  private readonly storageSettings = computed<ModuleStorage>(() => ({
    isAutoThemeMode: unwrap.get(this.isAutoThemeMode),
    localThemes: JSON.parse(unwrap.get(this.storageLocalThemes)),
    globalThemesCache: JSON.parse(unwrap.get(this.storageGlobalThemesCache)),
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
  }

  private _initWatchers(): void {
    const rootStylesKey = ':root';
    const uiStylesKey = `#${this.config.keys.sandbox.replaceAll(':', '\\:')}, #${this.config.keys.editor.replaceAll(':', '\\:')}`;
    let transitionLockTimeout: NodeJS.Timeout;

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
          [Object.keys(property.scopes).map(scopeId => `[${scopeId}]`).join(',\n')]: property.styles
        }), {})
      );
    });

    watch(this.selectedTheme, () => {
      clearTimeout(transitionLockTimeout);

      this._appendStyleToHead(
        `${this.config.keys.style}:transition`,
        { '*': { transition: 'color 0s, background-color 0s, border-color 0s, box-shadow 0s !important' } },
        false
      );

      transitionLockTimeout = setTimeout(() => this._appendStyleToHead(
        `${this.config.keys.style}:transition`,
        {},
        false
      ), 100);
    });

    watch(this.selectedEditedThemeId, (themeId) => {
      if (!this.getPopupSelfStatus()) this.reloadMiddleware[themeId ? 'on' : 'off']();
      this.useEvBus({ type: 'themeEditedStatus', id: themeId });
    });

    watch(this.storageSettings, this._saveStorage.bind(this));

    watch(this.isBlockVisible, status => status && this._openOnlySelectedThemeBlock(), { immediate: true });

    watch(() => this.router.route.path, () => this.errorsMessages.filter(error => error.timestamp + 1000 < Date.now()).splice(0));
  }

  private _readSystemThemes(): void {
    const getConnectorTheme = (themeName: string) => (connectorMeta as any)[`THEME_${themeName}`] as ModuleDefineThemeBlockRootReturn;
    this.themes.splice(0);

    const defaultThemeName = this.configThemeSystem.default;
    const defaultTheme = this._buildSystemTheme(getConnectorTheme(defaultThemeName), defaultThemeName, 'system');

    this.themes.push(
      reactive(defaultTheme),
      ...this.config.themesNames
        .filter(themeName => themeName !== defaultThemeName)
        .reduce<ModuleTheme[]>((accum, themeName) => {
          const buildTheme = this._buildSystemTheme(getConnectorTheme(themeName), themeName, 'system');
          buildTheme.setStyles(utils.mergeThemes(
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
      this.configThemeSystem.default,
      this.configThemeSystem.defaultDark,
      undefined,
      undefined,
      this.configThemeSystem.default,
      this.configThemeSystem.default
    );
  }

  private _openOnlySelectedThemeBlock(): void {
    this.setThemesBlockSystemStatus(unwrap.get(this.selectedTheme)?.type === 'system' ? 1 : 0);
    this.setThemesBlockGlobalStatus(unwrap.get(this.selectedTheme)?.type === 'global' ? 2 : 0);
    this.setThemesBlockLocalStatus(unwrap.get(this.selectedTheme)?.type === 'local' ? 1 : 0);
  }

  private _replaceSelectedThemes(light?: ThemeId, dark?: ThemeId, main?: ThemeId, lightDef?: ThemeId, darkDef?: ThemeId, mainDef?: ThemeId): void {
    const lightId = this._checkThemeAvailableAndGetActual(unwrap.get(light ?? this.selectedLightThemeId), lightDef, 'light');
    this._selectThemeAs('light', lightId, true);

    const darkId = this._checkThemeAvailableAndGetActual(unwrap.get(dark ?? this.selectedDarkThemeId), darkDef, 'dark');
    this._selectThemeAs('dark', darkId, true);

    const mainId = this._checkThemeAvailableAndGetActual(unwrap.get(main ?? this.selectedMainThemeId), mainDef, unwrap.get(this.isAutoThemeMode) ? 'system' : unwrap.get(this.selectedLightThemeId));
    this._selectThemeAs('main', mainId, true);
  }

  private _readStorage(compareLocals = false): void {
    const storage = JSON.parse(localStorage.getItem(this.config.keys.storage) as string) as ModuleStorage | null;

    if (storage) {
      const storageThemes = [...storage.localThemes, ...storage.globalThemesCache];

      const themesForAdd = storageThemes
        .filter(theme => !this.getThemeById(theme.id) || !compareLocals)
        .map(theme => this._buildCustomTheme(theme))
        .filter(Boolean)
        .map(theme => reactive(theme!));

      for (const theme of storageThemes.filter(theme => this.getThemeById(theme.id) && compareLocals)) {
        const localTheme = this.getThemeById(theme.id)!;

        localTheme.setType(theme.type);
        localTheme.setName(theme.name);
        localTheme.setDescription(theme.description);
        localTheme.setStyles(theme.styles);
      }
      for (const theme of this.themes.filter(theme => theme.type === 'local' && !storageThemes.find(sTheme => sTheme.id === theme.id))) {
        this.themes.splice(this.themes.findIndex(sTheme => sTheme.id === theme!.id), 1);
      }

      this.themes.push(...themesForAdd);

      this._replaceSelectedThemes(
        this._checkThemeAvailableAndGetActual(storage.selectedLightThemeId, 'light'),
        this._checkThemeAvailableAndGetActual(storage.selectedDarkThemeId, 'dark'),
        this._checkThemeAvailableAndGetActual(storage.selectedMainThemeId, unwrap.get(this.isAutoThemeMode) ? 'system' : unwrap.get(this.selectedLightThemeId))
      );
      setTimeout(() => this.setAutoThemeModeStatus(storage.isAutoThemeMode));
    }
  }

  private _saveStorage(): void {
    localStorage.setItem(this.config.keys.storage, JSON.stringify(unwrap.get(this.storageSettings)));
    this.useEvBus({ type: 'updateStorage' });
  }

  private _buildCustomTheme(themeRAW: ModuleThemeRAW, previewMode = false): ModuleThemeRef | undefined {
    if (
      (!this.isGlobalThemesEnabled && themeRAW.type === 'global')
      || (!this.isLocalThemesEnabled && themeRAW.type === 'local')
    ) return;

    const theme = new Theme(
      this,
      themeRAW.id,
      themeRAW.type,
      previewMode
        ? themeRAW.styles
        : utils.mergeThemes(themeRAW.styles, unwrap.get(this.getThemeById(this.configThemeSystem.default)!.getStyles())),
      themeRAW.name,
      themeRAW.description
    );

    this._checkAndFixIdsThemesConflict(theme, 'self', useLang('errorsMessages.idConflict.globalTitle'));

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
            name: useLang('pageEditThemeStyles.uiHeader'),
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
            name: useLang('pageEditThemeStyles.previewHeader'),
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
    else if (currentDef === 'light') return this._checkThemeAvailableAndGetActual(this.configThemeSystem.default);
    else if (currentDef === 'dark') return this._checkThemeAvailableAndGetActual(this.configThemeSystem.defaultDark);
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

  private _appendStyleToHead(id: string, scopes: ModuleObject<ModuleThemeScopesStyles>, keyAsVar = true): void {
    const styleContent = Object.keys(scopes).map((scopeId) => {
      const scopeStyles = scopes[scopeId];
      return [
        `${scopeId} {`,
        ...Object.keys(scopeStyles).map((key) => {
          const isImportant = key.startsWith('_');
          const viewKey = isImportant ? key.slice(1) : key;
          return `  ${keyAsVar ? '--' : ''}${viewKey}: ${unwrap.get(scopeStyles)[key]}${isImportant ? ' !important' : ''};`;
        }),
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

    Object.assign(this.themesPathsCache, finder(this.getThemeById(this.configThemeSystem.default)!.getStyles().value));
  }

  private _selectThemeAs(as: ThemeSelectableType, themeId?: string, async = false): void {
    const theme = this.getThemeById(themeId);
    const functionName = `setSelectedAs${as[0].toUpperCase() + as.slice(1)}`;

    if (theme) (theme as any)[functionName](true, async);
    else this.unselectAllThemesAs(as);
  }

  private _checkAndFixIdsThemesConflict(theme: ModuleTheme | ModuleThemeRef, replace: 'self' | 'him', message: string): void {
    const initThemeId = unwrap.get(theme.id);
    const storageTheme = this.getThemeById(initThemeId);

    if (storageTheme) {
      const fixedTheme = replace === 'self' ? theme : storageTheme;
      fixedTheme.setId(`${initThemeId}-${utils.getUUID().slice(-4)}`);
      this.createError('WARN', 'index', useLang('errorsMessages.idConflict.message')(initThemeId, unwrap.get(fixedTheme.id), unwrap.get(fixedTheme.name)), message);
    }
  }

  private _evBusListener(message: any): void {
    if (this.getPopupSelfStatus()) return;
    const config = message.data as ModuleEvBusClientExtend | ModuleEvBusThemeExtend;

    switch (config.scope) {
      case 'client':
        switch (config.type) {
          case 'close':
            if (config.page.startsWith('editThemeStyles')) this.router.push(config.page);
            this.setPopupStatus(false);
            break;
          case 'updateStorage':
            this._readStorage(true);
            setTimeout(() => this._openOnlySelectedThemeBlock());
            break;
          case 'themeEditedStatus':
            this.setThemeSelectedAsEdited(config.id);
            break;
        }
        break;
      case 'theme':
        this.themes.forEach((theme: any) => theme._evBusListener(message));
        break;
    }
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

  getPopupSelfStatus(): boolean {
    return unwrap.get(this.isPopupSelf);
  }

  getPopupStatus(): boolean {
    return unwrap.get(this.isPopupActive);
  }

  getPopupWindow(): WindowProxy | null {
    return unwrap.get(this.popupWindowRef);
  }

  getBlockStatus(): boolean {
    return unwrap.get(this.isBlockVisible);
  }

  getStorage(): ModuleStorage {
    return unwrap.get(this.storageSettings);
  }

  getGlobalBlockEnabledStatus(): boolean {
    return this.isGlobalThemesEnabled;
  }

  getLocalBlockEnabledStatus(): boolean {
    return this.isLocalThemesEnabled;
  }

  getEditingModeStatus(): boolean {
    return unwrap.get(this.isEditingModeEnabled);
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

  getErrors(type?: ModuleErrorType, page?: ModulePagesNames | ModulePagesNames[]): ModuleErrorMessage[] {
    const pages = page ? Array.isArray(page) ? page : [page] : this.router.getPagesNames();
    return this.errorsMessages.filter(error => (type ? error.type === type : true) && pages.some(page => error.page.includes(page)));
  }

  getThemesBlockSystemStatus(): ThemeBlockStatus {
    return unwrap.get(this.themesBlockSystemStatus);
  }

  getThemesBlockGlobalStatus(): ThemeBlockStatus {
    return unwrap.get(this.themesBlockGlobalStatus);
  }

  getThemesBlockLocalStatus(): ThemeBlockStatus {
    return unwrap.get(this.themesBlockLocalStatus);
  }

  setPopupStatus(status: boolean): void {
    if (this.getPopupSelfStatus()) return;
    const storageWin = unwrap.get(this.popupWindowRef);
    let win = null;

    if (status) {
      const width = 400;
      const height = window.innerHeight;
      const left = window.screenX + window.innerWidth - width;
      const top = window.screenY + (window.innerHeight - height) / 2;

      win = window.open('/popup', 'popupWindow', `width=${width},height=${height},left=${left},top=${top},resizable=no`);
      this.popupChannel.onmessage = this._evBusListener.bind(this);
    } else if (storageWin) {
      this.popupChannel.onmessage = () => {};
      storageWin.close();
    }

    unwrap.set(this, 'popupWindowRef', win);
    unwrap.set(this, 'isPopupActive', !!win);
  }

  setBlockStatus(status: boolean): void {
    if (this.getPopupStatus()) {
      this.setPopupStatus(false);
    }

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

  setThemesBlockSystemStatus(status: ThemeBlockStatus): void {
    unwrap.set(this, 'themesBlockSystemStatus', status);
  }

  setThemesBlockGlobalStatus(status: ThemeBlockStatus): void {
    unwrap.set(this, 'themesBlockGlobalStatus', status);
  }

  setThemesBlockLocalStatus(status: ThemeBlockStatus): void {
    unwrap.set(this, 'themesBlockLocalStatus', status);
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

  createError(type: ModuleErrorType, page: ModulePagesNames | ModulePagesNames[], message: string, title?: string, uuid?: string): number {
    const uuidMessage = this.errorsMessages.find(message => message.uuid === uuid);

    if (uuidMessage) {
      uuidMessage.type = type;
      uuidMessage.page = Array.isArray(page) ? page : [page];
      uuidMessage.message = message;
      uuidMessage.title = title;
      uuidMessage.timestamp = Date.now();
      return uuidMessage.id;
    } else {
      const id = Math.max(...this.errorsMessages.map(error => error.id), 0) + 1;
      this.errorsMessages.push({
        id,
        type,
        page: Array.isArray(page) ? page : [page],
        message,
        title,
        timestamp: Date.now(),
        uuid
      });
      return id;
    }
  }

  createScopeStyles(scopeId: string, blockPath: ModuleDefaultBlockKeys, styles: ComputedRef<ModuleObject>): void {
    const blockPathStyles = this.usesScopesProperties[blockPath];

    if (blockPathStyles) {
      if (!blockPathStyles.scopes[scopeId]) {
        blockPathStyles.scopes[scopeId] = 1;
      } else {
        blockPathStyles.scopes[scopeId]++;
      }
    } else {
      this.usesScopesProperties[blockPath] = {
        scopes: { [scopeId]: 1 },
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

  deleteError(id: number | string): void {
    const errorIndex = this.errorsMessages.findIndex(error => (typeof id === 'number' ? error.id : error.uuid) === id);
    if (errorIndex !== -1) this.errorsMessages.splice(errorIndex, 1);
  }

  deleteScopeStyles(scopeId: string, blockPath: ModuleDefaultBlockKeys): void {
    const blockPathStyles = this.usesScopesProperties[blockPath];

    if (blockPathStyles) {
      if (blockPathStyles.scopes[scopeId] > 1) blockPathStyles.scopes[scopeId]--;
      else delete blockPathStyles.scopes[scopeId];
      if (Object.keys(blockPathStyles.scopes).length === 0) delete this.usesScopesProperties[blockPath];
    }
  }

  unselectAllThemesAs(as: ThemeSelectableType): void {
    const functionName = `setSelectedAs${as[0].toUpperCase() + as.slice(1)}`;
    this.themes.forEach((theme: any) => theme[functionName](false));
  }

  useEvBus(config: ModuleEvBusClient): void {
    if (!this.getPopupSelfStatus()) return;

    this.popupChannel.postMessage({
      scope: 'client',
      ...config
    });
  }

  async loadGlobalThemes(): Promise<void> {
    const ctx = this;

    function getOnlyPreviewBlock(theme: ModuleLocalStorageThemeMini): ModuleThemeCleanedStyles[] {
      const defaultThemeStyles = unwrap.get(ctx.getThemeById(ctx.configThemeSystem.default)!.getStyles());

      return [
        ...defaultThemeStyles.slice(0, -1).map(block => ({
          id: block.id,
          styles: [{}],
          settings: block.settings as ModuleDefineThemeBlockSettings
        })),
        {
          id: ctx.runtimePreviewId,
          styles: [JSON.parse(theme.previewStylesJSON)],
          settings: defaultThemeStyles.at(-1)!.settings as ModuleDefineThemeBlockSettings
        }
      ];
    }
    function deleteTheme(theme: ModuleTheme): void {
      ctx.themes.splice(ctx.themes.indexOf(theme), 1);
    }
    function addTheme(theme: ModuleLocalStorageThemeMini): void {
      const buildTheme = ctx._buildCustomTheme({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        timestamp: theme.timestamp,
        type: 'global',
        styles: getOnlyPreviewBlock(theme)
      }, true);

      if (buildTheme) ctx.themes.push(reactive(buildTheme));
    }
    function editTheme(theme: ModuleLocalStorageThemeMini): void {
      const localTheme = ctx.getThemeById(theme.id)!;

      if (localTheme.type === 'system') {
        return;
      } else if (localTheme.type === 'global') {
        localTheme.setName(theme.name);
        localTheme.setDescription(theme.description);
        localTheme.setTimestamp(theme.timestamp);
        localTheme.setInitStatus(false);

        if (localTheme.isInCache) localTheme.loadInfo(undefined, true);
        else localTheme.setStyles(getOnlyPreviewBlock(theme), undefined, true);
      } else if (localTheme.type === 'local') {
        ctx._checkAndFixIdsThemesConflict(localTheme, 'self', useLang('errorsMessages.idConflict.globalTitle'));
        addTheme(theme);
      }
    }

    try {
      const loadedThemes = await useAPIFetch('GET', '/themes/', {});

      const remoteThemesIds = loadedThemes.map(theme => theme.id);
      const currentThemesIds = this.themes.map(theme => theme.id);

      const themesForDelete = this.themes.filter(theme => theme.type === 'global' && !remoteThemesIds.includes(theme.id));
      const themesForAdd = loadedThemes.filter(theme => !currentThemesIds.includes(theme.id));
      const themesForEdit = loadedThemes.filter(theme => currentThemesIds.includes(theme.id));

      themesForDelete.forEach(deleteTheme);
      themesForAdd.forEach(addTheme);
      themesForEdit.forEach(editTheme);

      this.setThemesBlockGlobalStatus(1);
      this._replaceSelectedThemes();
    } catch {
      this.createError(
        'ERROR',
        'index',
        useLang('errorsMessages.loadThemes.message'),
        useLang('errorsMessages.loadThemes.title'),
        'err_load_global'
      );
    }
  }
}
