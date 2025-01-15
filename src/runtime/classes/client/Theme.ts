import type { ComputedRef } from 'vue';
import type {
  ModuleClient,
  ModuleDefaultBlockKeys, ModuleDefaultStyleKeys, ModuleDefineThemeBlockSetting,
  ModuleDefineThemeMetaPreview, ModuleDefineThemeMetaUI,
  ModuleObject, ModuleOptionsExtend, ModuleThemeCleanedSetting,
  ModuleThemeSelectedStyles, ModuleThemeType
} from '../../types';
import useIdProtect from '../../helpers/client/useIdProtect';
import utils from '../../helpers/utils';
import unwrap from '../../helpers/client/unwrap';
import { computed, reactive, ref, watch } from '#imports';

type ThemeStylesScope = 'main' | 'edited';

export class Theme {
  private ctx: ModuleClient;
  private config!: ModuleOptionsExtend;

  private pathsCache!: ModuleObject<(number | string)[]>;
  private md5Cache: ModuleObject = {};

  public readonly id = ref<string>('');
  public readonly type = ref<ModuleThemeType>('local');
  public readonly name = ref<string>('');
  public readonly description = ref<string>('');

  public readonly isSelected = computed(() => unwrap.get(this.ctx.getSelectedThemeId()) === unwrap.get(this.id));
  public readonly isSelectedAsMain = ref(false);
  public readonly isSelectedAsLight = ref(false);
  public readonly isSelectedAsDark = ref(false);
  public readonly isSelectedAsEdited = ref(false);

  private runtimePreviewId = useIdProtect('preview');
  private runtimeUIId = useIdProtect('ui');

  private styles = reactive([] as ModuleThemeCleanedSetting[]);
  private editedStyles = reactive([] as ModuleThemeCleanedSetting[]);
  private preparedStyles = reactive([] as ModuleThemeCleanedSetting[]);
  private previewStyles = reactive({} as ModuleDefineThemeMetaPreview);

  constructor(
    ctx: ModuleClient,
    id: string,
    type: ModuleThemeType,
    styles: ModuleThemeCleanedSetting[],
    name?: string,
    description?: string
  ) {
    this.ctx = ctx;
    this.id.value = id;
    this.type.value = type;
    this.name.value = name ?? id;
    this.description.value = description ?? '';
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
      console.log(123);
      this._buildAllStyles('edited');
    });
  }

  private _buildPreviewStyles() {
  }

  private _buildAllStyles(scope: ThemeStylesScope = 'main') {
    utils.replaceArrayData(
      this.preparedStyles,
      utils.copyObject(this._geyStylesByScope(scope)).map(style => this._fillStylesBlock(style, scope))
    );
  }

  private _getPathsCacheValue<Type extends 'B' | 'S'>(type: Type, blockPath: string, styles?: ModuleThemeSelectedStyles[]): (Type extends 'S' ? string : ModuleObject) | undefined {
    const fullBlockPath = `${type}.${blockPath}`;

    if (styles && fullBlockPath in this.pathsCache) {
      return this.pathsCache[fullBlockPath].reduce((acc, index) => acc?.styles?.[index] ?? acc?.[index], { styles } as any);
    }
  }

  private _geyStylesByScope(scope: ThemeStylesScope) {
    return scope === 'main' ? this.styles : this.editedStyles;
  }

  private _fillStylesBlock(stylesBlock: ModuleThemeCleanedSetting, scope: ThemeStylesScope = 'main') {
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
    const prepareBlock = (stylesBlock: ModuleThemeCleanedSetting, parentPath: string[] = []): ModuleThemeSelectedStyles => {
      if (stylesBlock.id) return {
        id: stylesBlock.id,
        styles: (stylesBlock.styles as ModuleDefineThemeBlockSetting[]).map(style => prepareBlock(style, [...parentPath, stylesBlock.id]))
      };

      const stylesBlockAny = stylesBlock as any;
      for (const styleKey of Object.keys(stylesBlockAny)) {
        const styleValue = stylesBlockAny[styleKey] as string;
        const selfPath = [...parentPath, styleKey].join('.');
        stylesBlockAny[styleKey] = getStyleByPath(selfPath, styleValue);
      }

      return stylesBlockAny;
    };

    return prepareBlock(stylesBlock);
  }

  setId(id: string): void {
    unwrap.set(this, 'id', id);
  }

  setName(name: string): void {
    unwrap.set(this, 'name', name);
  }

  setDescription(description: string): void {
    unwrap.set(this, 'description', description);
  }

  setSelectedAsMain(state = true) {
    if (state) this.ctx.unselectAllThemesAs('main');
    unwrap.set(this, 'isSelectedAsMain', state);
  }

  setSelectedAsLight(state = true) {
    if (state) this.ctx.unselectAllThemesAs('light');
    unwrap.set(this, 'isSelectedAsLight', state);
  }

  setSelectedAsDark(state = true) {
    if (state) this.ctx.unselectAllThemesAs('dark');
    unwrap.set(this, 'isSelectedAsDark', state);
  }

  setSelectedAsEdited(state = true) {
    if (state) {
      this.ctx.unselectAllThemesAs('edited');
      utils.replaceArrayData(this.editedStyles, utils.copyObject(this.styles));
    }
    unwrap.set(this, 'isSelectedAsEdited', state);
  }

  setStyles(styles: ModuleThemeCleanedSetting[], scope: ThemeStylesScope = 'main'): void {
    utils.replaceArrayData(this._geyStylesByScope(scope), styles);
  }

  setStyleValue(stylePath: ModuleDefaultStyleKeys, newValue: string, scope: ThemeStylesScope = 'main'): void {
    const cache = this.pathsCache[`S.${stylePath}`];

    if (cache) {
      cache.reduce((acc, index, i) => {
        if (cache.length > i + 1) {
          return acc?.styles?.[index];
        } else {
          acc[index] = newValue;
          return acc;
        }
      }, { styles: this._geyStylesByScope(scope) } as any);
    }
  }

  getStylesBlock(blockPath: ModuleDefaultBlockKeys, scope: ThemeStylesScope = 'main'): ComputedRef<ModuleObject> {
    return computed(() => this._getPathsCacheValue('B', blockPath, this._geyStylesByScope(scope)) ?? {});
  }

  getStyleValue(stylePath: ModuleDefaultStyleKeys, scope: ThemeStylesScope = 'main'): ComputedRef<string> {
    return computed(() => this._getPathsCacheValue('S', stylePath, this._geyStylesByScope(scope)) ?? 'UNKNOWN STYLE');
  }

  getStyles(scope: ThemeStylesScope = 'main'): ComputedRef<ModuleThemeCleanedSetting[]> {
    return computed(() => this._geyStylesByScope(scope));
  }

  getStylesWithoutSystem(scope: ThemeStylesScope = 'main'): ComputedRef<ModuleThemeCleanedSetting[]> {
    return computed(() => this._geyStylesByScope(scope).filter(block => !block.id.startsWith(this.config.systemUUID.toString())) ?? []);
  }

  getStylesPreview(scope: ThemeStylesScope = 'main'): ComputedRef<ModuleDefineThemeMetaPreview> {
    return this.getStylesBlock(this.runtimePreviewId, scope);
  }

  getStylesUI(scope: ThemeStylesScope = 'main'): ComputedRef<ModuleDefineThemeMetaUI> {
    return this.getStylesBlock(this.runtimeUIId, scope);
  }

  getPreparedStylesBlock(blockPath: ModuleDefaultBlockKeys): ComputedRef<ModuleObject> {
    return computed(() => this._getPathsCacheValue('B', blockPath, this.preparedStyles) ?? {});
  }

  getPreparedStyleValue(stylePath: ModuleDefaultStyleKeys): ComputedRef<string> {
    return computed(() => this._getPathsCacheValue('S', stylePath, this.preparedStyles) ?? 'UNKNOWN STYLE');
  }

  getPreparedStyles(): ComputedRef<ModuleThemeCleanedSetting[]> {
    return computed(() => this.preparedStyles);
  }

  getPreparedStylesWithoutSystem(): ComputedRef<ModuleThemeCleanedSetting[]> {
    return computed(() => this.preparedStyles.filter(block => !block.id.startsWith(this.config.systemUUID.toString())) ?? []);
  }

  getPrepareStylesPreview(): ComputedRef<ModuleDefineThemeMetaPreview> {
    return this.getPreparedStylesBlock(this.runtimePreviewId);
  }

  getPrepareStylesUI(): ComputedRef<ModuleDefineThemeMetaUI> {
    return this.getPreparedStylesBlock(this.runtimeUIId);
  }

  getStylesCopy(): ComputedRef<ModuleThemeCleanedSetting[]> {
    return computed(() => utils.copyObject(this.styles));
  }
}
