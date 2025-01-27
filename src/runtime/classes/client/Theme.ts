import type { ComputedRef } from 'vue';
import { md5 } from 'js-md5';
import type {
  ModuleClient,
  ModuleDefaultBlockKeys, ModuleDefaultStyleKeys, ModuleDefineThemeBlockReturn,
  ModuleDefineThemeMetaPreview, ModuleDefineThemeMetaUI, ModuleLocalStorageTheme,
  ModuleObject, ModuleOptionsExtend, ModulePathsCache, ModuleThemeCleanedStyles, ModuleThemeEditData,
  ModuleThemeSelectedStyles, ModuleThemeType
} from '../../types';
import utils from '../../helpers/utils';
import unwrap from '../../helpers/client/unwrap';
import useAPIFetch from '../../helpers/client/useAPIFetch';
import useSwitch from '../../helpers/client/useSwitch';
import useIdProtect from '../../helpers/useIdProtect';
import { computed, reactive, ref, watch } from '#imports';

type ThemeStylesScope = 'main' | 'edited';

export class Theme {
  private ctx: ModuleClient;
  private config!: ModuleOptionsExtend;

  private pathsCache!: ModulePathsCache;
  private md5Cache: ModuleObject<Uint8Array> = {};

  public readonly id = ref<string>('');
  public readonly type = ref<ModuleThemeType>('local');
  public readonly name = ref<string>('');
  public readonly description = ref<string>('');
  public readonly isInit = ref(false);
  public readonly isInCache = computed(() => unwrap.get(this.type) === 'global' && (unwrap.get(this.isSelectedAsMain) || unwrap.get(this.isSelectedAsLight) || unwrap.get(this.isSelectedAsDark)));
  public readonly loader = useSwitch();

  public readonly isSelected = computed(() => unwrap.get(this.ctx.getSelectedThemeId()) === unwrap.get(this.id));
  public readonly isSelectedAsMain = ref(false);
  public readonly isSelectedAsLight = ref(false);
  public readonly isSelectedAsDark = ref(false);
  public readonly isSelectedAsEdited = ref(false);

  public readonly runtimePreviewId = useIdProtect('preview');
  public readonly runtimeUIId = useIdProtect('ui');

  private styles = reactive([] as ModuleThemeCleanedStyles[]);
  private editedStyles = reactive([] as ModuleThemeCleanedStyles[]);
  private preparedStyles = reactive([] as ModuleThemeCleanedStyles[]);
  private preparedPreviewStyles = reactive({} as ModuleDefineThemeMetaPreview);
  private preparedUIStyles = reactive({} as ModuleDefineThemeMetaUI);

  constructor(
    ctx: ModuleClient,
    id: string,
    type: ModuleThemeType,
    styles: ModuleThemeCleanedStyles[],
    name?: string,
    description?: string
  ) {
    this.ctx = ctx;
    this.id.value = id;
    this.type.value = type;
    this.name.value = name || id;
    this.description.value = description || '';
    this.setStyles(styles);

    this._initCtxData();
    this._initWatchers();
  }

  private _initCtxData() {
    this.config = this.ctx.getConfig();
    this.pathsCache = this.ctx.getThemesPathsCache();
  }

  private _initWatchers() {
    watch(this.isSelected, (status) => {
      if (status) {
        this._buildAllStyles(unwrap.get(this.isSelectedAsEdited) ? 'edited' : 'main');
      }
    });

    watch(this.isSelectedAsEdited, (status) => {
      this._buildAllStyles(status ? 'edited' : 'main');
    });

    watch(this.editedStyles, () => {
      this._buildAllStyles('edited');
    });

    watch(this.pathsCache, () => {
      this._buildPreviewStyles();
    }, { immediate: !!Object.keys(this.pathsCache).length });
  }

  private _buildPreviewStyles(scope: ThemeStylesScope = 'main') {
    const rawStyles = unwrap.get(this.getStylesPreview(scope));
    const rawStylesCopy = utils.copyObject(rawStyles);

    utils.replaceObjectData(
      this.preparedPreviewStyles,
      this._fillStylesBlock(rawStylesCopy, scope)
    );
  }

  private _buildUIStyles(scope: ThemeStylesScope = 'main') {
    const rawStyles = unwrap.get(this.getStylesUI(scope));
    const rawStylesCopy = utils.copyObject(rawStyles);

    utils.replaceObjectData(
      this.preparedUIStyles,
      this._fillStylesBlock(rawStylesCopy, scope)
    );
  }

  private _buildCustomStyles(scope: ThemeStylesScope = 'main') {
    const rawStyles = unwrap.get(this.getStylesWithoutSystem(scope));

    if (!this._validateMd5Cache('custom', rawStyles)) {
      const rawStylesCopy = utils.copyObject(rawStyles);

      utils.replaceObjectData(
        this.preparedStyles,
        rawStylesCopy.map(style => this._fillStylesBlock(style, scope))
      );
    }
  }

  private _buildAllStyles(scope: ThemeStylesScope = 'main') {
    this._buildPreviewStyles(scope);
    this._buildUIStyles(scope);
    this._buildCustomStyles(scope);
  }

  private _getPathsCacheValue<Type extends 'B' | 'S'>(type: Type, blockPath: string, styles?: ModuleThemeSelectedStyles[], withInheritance?: boolean): (Type extends 'S' ? string : ModuleObject) | undefined {
    const fullBlockPath = `${type}.${blockPath}`;

    if (styles && fullBlockPath in this.pathsCache) {
      const blockUsedInheritance = this.pathsCache[fullBlockPath][0];
      const stylesPath = this.pathsCache[fullBlockPath].slice(1);

      if (withInheritance || blockUsedInheritance) {
        const inheritanceBlockPath = blockPath.split('.').slice(0, -1).join('.');
        const inheritanceCache = this._getPathsCacheValue('B', inheritanceBlockPath, styles, true);

        return {
          ...inheritanceCache,
          ...stylesPath.reduce((acc, index) => acc?.styles?.[index] ?? acc?.[index], { styles } as any)
        };
      } else {
        return stylesPath.reduce((acc, index) => acc?.styles?.[index] ?? acc?.[index], { styles } as any);
      }
    }
  }

  private _geyStylesByScope(scope: ThemeStylesScope) {
    return scope === 'main' ? this.styles : this.editedStyles;
  }

  private _fillStylesBlock(stylesBlock: ModuleThemeCleanedStyles, scope: ThemeStylesScope = 'main') {
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
      if (styleValue.startsWith('$') && styleValue.length > 1) {
        const relationPath = styleValue.slice(1);

        if (isCircularRelation(selfPath, relationPath)) {
          return 'CIRCULAR';
        } else {
          relationsPaths[selfPath] = relationPath;
          return getStyleByPath(relationPath, unwrap.get(this.getStyleValue(relationPath, scope)));
        }
      }

      return styleValue;
    };
    const prepareBlock = (themeStyle: ModuleThemeCleanedStyles, parentPath: string[] = []): ModuleThemeSelectedStyles => {
      const themeStyleTyped = themeStyle as ModuleDefineThemeBlockReturn;

      if (themeStyleTyped.id) return {
        id: themeStyleTyped.id,
        styles: themeStyleTyped.styles.map(style => prepareBlock(style, [...parentPath, stylesBlock.id])),
        settings: themeStyleTyped.settings
      };

      const stylesBlockAny = themeStyle as any;
      for (const styleKey in stylesBlockAny) {
        const styleValue = stylesBlockAny[styleKey] as string;
        const selfPath = [...parentPath, styleKey].join('.');
        stylesBlockAny[styleKey] = getStyleByPath(selfPath, styleValue);
      }

      return stylesBlockAny;
    };

    return prepareBlock(stylesBlock);
  }

  private _validateMd5Cache(key: string, obj: ModuleObject<any>): boolean {
    const cache = this.md5Cache;
    const cachedObj = new Uint8Array(md5.arrayBuffer(JSON.stringify(obj)));

    if (!cache[key]) {
      cache[key] = cachedObj;
      return false;
    } else {
      const readCache = new Uint8Array(cache[key]);

      for (let byteI = 0; byteI < cachedObj.length; byteI++) {
        if (cachedObj[byteI] !== readCache[byteI]) {
          cache[key] = cachedObj;
          return false;
        }
      }

      return true;
    }
  }

  setId(id: string): void {
    unwrap.set(this, 'id', id);
  }

  setName(name: string): void {
    unwrap.set(this, 'name', name || unwrap.get(this.id));
  }

  setDescription(description: string): void {
    unwrap.set(this, 'description', description);
  }

  setInitStatus(status: boolean): void {
    unwrap.set(this, 'isInit', status);
  }

  async setSelectedAsMain(state = true): Promise<void> {
    if (state) {
      await this.loadInfo();
      this.ctx.unselectAllThemesAs('main');
    }
    unwrap.set(this, 'isSelectedAsMain', state);
  }

  async setSelectedAsLight(state = true): Promise<void> {
    if (state) {
      await this.loadInfo();
      this.ctx.unselectAllThemesAs('light');
    }
    unwrap.set(this, 'isSelectedAsLight', state);
  }

  async setSelectedAsDark(state = true): Promise<void> {
    if (state) {
      await this.loadInfo();
      this.ctx.unselectAllThemesAs('dark');
    }
    unwrap.set(this, 'isSelectedAsDark', state);
  }

  async setSelectedAsEdited(state = true): Promise<void> {
    if (state) {
      await this.loadInfo();
      this.ctx.unselectAllThemesAs('edited');
      utils.replaceArrayData(this.editedStyles, utils.copyObject(this.styles));
    }
    unwrap.set(this, 'isSelectedAsEdited', state);
  }

  setStyles(styles: ModuleThemeCleanedStyles[], scope: ThemeStylesScope = 'main'): void {
    utils.replaceArrayData(this._geyStylesByScope(scope), styles);
  }

  setStyleValue(stylePath: ModuleDefaultStyleKeys, newValue: string, scope: ThemeStylesScope = 'main'): void {
    const cache = this.pathsCache[`S.${stylePath}`];

    if (cache) {
      const cacheSliced = cache.slice(1);
      cacheSliced.reduce((acc, index, i) => {
        if (cacheSliced.length > i + 1) {
          return acc?.styles?.[index];
        } else {
          acc[index] = newValue;
          return acc;
        }
      }, { styles: this._geyStylesByScope(scope) } as any);
    }
  }

  getConfig(): ModuleOptionsExtend {
    return this.config;
  }

  getStylesBlock(blockPath: ModuleDefaultBlockKeys, scope: ThemeStylesScope = 'main'): ComputedRef<ModuleObject> {
    return computed(() => this._getPathsCacheValue('B', blockPath, this._geyStylesByScope(scope)) ?? {});
  }

  getStyleValue(stylePath: ModuleDefaultStyleKeys, scope: ThemeStylesScope = 'main'): ComputedRef<string> {
    return computed(() => this._getPathsCacheValue('S', stylePath, this._geyStylesByScope(scope)) ?? 'UNKNOWN STYLE');
  }

  getStyles(scope: ThemeStylesScope = 'main'): ComputedRef<ModuleThemeCleanedStyles[]> {
    return computed(() => this._geyStylesByScope(scope));
  }

  getStylesWithoutSystem(scope: ThemeStylesScope = 'main'): ComputedRef<ModuleThemeCleanedStyles[]> {
    return computed(() => this._geyStylesByScope(scope).filter(block => !block.id.startsWith(this.config.systemUUID.toString())) ?? []);
  }

  getStylesPreview(scope: ThemeStylesScope = 'main'): ComputedRef<ModuleDefineThemeMetaPreview> {
    return this.getStylesBlock(this.runtimePreviewId, scope);
  }

  getStylesUI(scope: ThemeStylesScope = 'main'): ComputedRef<ModuleDefineThemeMetaUI> {
    return this.getStylesBlock(this.runtimeUIId, scope);
  }

  getPreparedStylesBlock(blockPath: ModuleDefaultBlockKeys, withInheritance?: boolean): ComputedRef<ModuleObject> {
    return computed(() => this._getPathsCacheValue('B', blockPath, this.preparedStyles, withInheritance) ?? {});
  }

  getPreparedStyleValue(stylePath: ModuleDefaultStyleKeys): ComputedRef<string> {
    return computed(() => this._getPathsCacheValue('S', stylePath, this.preparedStyles) ?? 'UNKNOWN STYLE');
  }

  getPreparedStylesWithoutSystem(): ComputedRef<ModuleThemeCleanedStyles[]> {
    return computed(() => this.preparedStyles);
  }

  getPrepareStylesPreview(): ComputedRef<ModuleDefineThemeMetaPreview> {
    return computed(() => this.preparedPreviewStyles);
  }

  getPrepareStylesUI(): ComputedRef<ModuleDefineThemeMetaUI> {
    return computed(() => this.preparedUIStyles);
  }

  getStylesCopy(): ComputedRef<ModuleThemeCleanedStyles[]> {
    return computed(() => utils.copyObject(this.styles));
  }

  saveEditedStyles(): void {
    if (!unwrap.get(this.isSelectedAsEdited)) return;

    this.setStyles(utils.copyObject(this.editedStyles));
  }

  async loadInfo(theme?: ModuleLocalStorageTheme): Promise<boolean> {
    if (unwrap.get(this.type) !== 'global') return false;

    try {
      if (!theme && !unwrap.get(this.isInit) && !this.loader.status) {
        theme = await useAPIFetch('GET', '/{id}', {
          params: {
            id: unwrap.get(this.id)
          }
        }, { loader: this.loader });
      }

      if (theme) {
        this.setName(theme.name);
        this.setDescription(theme.description);
        this.setStyles(JSON.parse(theme.stylesJSON));
        this.setInitStatus(true);
      }
      return true;
    } catch {
      this.ctx.createError(
        'ERROR',
        'index',
        'Error theme styles loading',
        'Error loading theme styles from the server. Please try again later.',
        'err_self_load_global'
      );
      return false;
    }
  }

  async publish(): Promise<boolean> {
    if (unwrap.get(this.type) !== 'local') return false;

    try {
      await useAPIFetch('POST', '/', {
        body: {
          id: unwrap.get(this.id),
          name: unwrap.get(this.name),
          description: unwrap.get(this.description),
          previewStylesJSON: JSON.stringify(unwrap.get(this.getPrepareStylesPreview())),
          stylesJSON: JSON.stringify(unwrap.get(this.getStyles()))
        }
      }, { loader: this.loader });

      unwrap.set(this, 'type', 'global');
      this.ctx.setThemesBlockGlobalStatus(2);
      return true;
    } catch {
      this.ctx.createError(
        'ERROR',
        'publishApprove',
        'Error theme publishing',
        'Error uploading the theme to the server. Please try again later.',
        'err_publish_global'
      );
      return false;
    }
  }

  async depublish(): Promise<boolean> {
    if (unwrap.get(this.type) !== 'global') return false;

    try {
      const theme = await useAPIFetch('DELETE', '/{id}', {
        params: {
          id: unwrap.get(this.id)
        }
      }, { loader: this.loader });
      await this.loadInfo(theme);

      unwrap.set(this, 'type', 'local');
      this.ctx.setThemesBlockGlobalStatus(2);
      return true;
    } catch {
      this.ctx.createError(
        'ERROR',
        'depublishApprove',
        'Error theme depublishing',
        'The error of removing a topic from publication. Please try again later.',
        'err_depublish_global'
      );
      return false;
    }
  }

  async editInfo(data: ModuleThemeEditData): Promise<boolean> {
    switch (unwrap.get(this.type)) {
      case 'system':
        return false;
      case 'global': {
        try {
          await useAPIFetch('PUT', '/{id}', {
            params: {
              id: unwrap.get(this.id)
            },
            body: {
              id: unwrap.get(data.id),
              name: unwrap.get(data.name),
              description: unwrap.get(data.description)
            }
          }, { loader: this.loader });

          this.ctx.setThemesBlockGlobalStatus(2);
          return true;
        } catch {
          this.ctx.createError(
            'ERROR',
            'editThemeInfo',
            'Information modification error',
            'An error occurred on the server when saving the information. Please try again later.',
            'err_edit_global'
          );
          return false;
        }
      }
      case 'local':
        this.setId(data.id);
        this.setName(data.name);
        this.setDescription(data.description);
        return true;
    }
  }

  async delete(): Promise<boolean> {
    switch (unwrap.get(this.type)) {
      case 'system':
        return false;
      case 'global': {
        try {
          await useAPIFetch('DELETE', '/{id}', {
            params: {
              id: unwrap.get(this.id)
            }
          }, { loader: this.loader });

          this.ctx.setThemesBlockGlobalStatus(2);
          return true;
        } catch {
          this.ctx.createError(
            'ERROR',
            'deleteTheme',
            'Error theme deleting',
            'An error occurred while deleting the theme. Please try again later.',
            'err_delete_global'
          );
          return false;
        }
      }
      case 'local':
        return this.ctx.deleteTheme(unwrap.get(this.id));
    }
  }
}
