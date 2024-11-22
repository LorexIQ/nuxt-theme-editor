import type {
  ModuleDefineThemeBlockRootReturn,
  ModuleDefineThemeBlockSetting,
  ModuleDefineThemeCleanedSetting,
  ModuleObject,
  ModuleOptionsExtend,
  ModuleThemeRootReturn,
  ModuleThemes,
  ModuleThemeType
} from '../types';
// @ts-ignore
import connectorMeta from '../meta/connector';
import unwrap from '../helpers/unwrap';
import defineChecker from '../helpers/defineChecker';
import { useRuntimeConfig } from '#imports';

export class Client {
  private readonly config = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  private readonly selectedThemeName = ref<string>();
  private readonly themes = reactive<ModuleThemes>({});
  private readonly usesDocumentProperties = reactive<ModuleObject>({});
  private readonly usesScopesProperties = reactive<ModuleObject<ModuleObject>>({});

  private readonly selectedTheme = computed(() => {
    const selectedTheme = unwrap.get(this.selectedThemeName);
    return selectedTheme && selectedTheme in this.themes ? this.themes[selectedTheme] : undefined;
  });

  constructor() {
    Object.assign(this.themes, this._readSystemThemes());
    this._readSelectedTheme();
    this._initWatchers();
  }

  private _initWatchers() {
    watch(this.selectedTheme, (theme) => {
      this._removeDocumentStyles();

      if (theme) {
        const globalStyles = theme.styles.find(block => block.id === 'global')!;
        this._registerDocumentStyles(globalStyles.styles[0] as ModuleObject);
      }
    }, { immediate: true });

    watch(this.usesDocumentProperties, (properties) => {
      const styleContent = [
        ':root {',
        ...Object.keys(properties).map(key => `  --${key}: ${properties[key]};`),
        '}'
      ].join('\n');

      const _styleElement = document.getElementById(this.config.keys.style);
      const styleElement = _styleElement ?? document.createElement('style');
      styleElement.id = this.config.keys.style;
      styleElement.textContent = styleContent;
      if (!_styleElement) document.head.appendChild(styleElement);
    }, { immediate: true });

    watch(this.usesScopesProperties, (scopes) => {
      const styleContent = Object.keys(scopes).map((scopeId) => {
        const scopeStyles = scopes[scopeId];
        return [
          `[${scopeId}] {`,
          ...Object.keys(scopeStyles).map(key => `  --${key}: ${scopeStyles[key]};`),
          '}'
        ].join('\n');
      }).join('\n\n');

      const _styleElement = document.getElementById(`${this.config.keys.style}:scope`);
      const styleElement = _styleElement ?? document.createElement('style');
      styleElement.id = `${this.config.keys.style}:scope`;
      styleElement.textContent = styleContent;
      if (!_styleElement) document.head.appendChild(styleElement);
    }, { immediate: true });
  }

  private _removeDocumentStyles(styles?: ModuleObject): void {
    const removesProperties = Object.keys(this.usesDocumentProperties).filter(property => styles ? property in styles : true);
    for (const propertyName of removesProperties) {
      delete this.usesDocumentProperties[propertyName];
    }
  }

  private _registerDocumentStyles(styles: ModuleObject): void {
    for (const [key, value] of Object.entries(styles)) {
      this.usesDocumentProperties[key] = value;
    }
  }

  private _prepareTheme(themeFile: ModuleDefineThemeBlockRootReturn, themeName: string, themeType: ModuleThemeType): ModuleThemeRootReturn {
    const cleanThemeStyles = (themeStyle: ModuleDefineThemeBlockSetting, selfId?: string): ModuleDefineThemeCleanedSetting => {
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

  private _readSelectedTheme(): void {
    const storageValue = localStorage.getItem(this.config.keys.storage);

    if (Object.keys(this.themes).length) {
      if (storageValue && storageValue in this.themes) {
        unwrap.set(this, 'selectedThemeName', storageValue);
      } else if (this.config.defaultTheme in this.themes) {
        unwrap.set(this, 'selectedThemeName', this.config.defaultTheme);
      }
    }
  }

  getConfig() {
    return this.config;
  }

  getThemes() {
    return this.themes;
  }

  getSelectedTheme() {
    return unwrap.get(this.selectedTheme);
  }

  selectTheme(themeName: string) {
    if (!(themeName in this.themes)) return;
    unwrap.set(this, 'selectedThemeName', themeName);
  }

  registerScopeStyles(blockPath: string, scopeId: string) {
    const searchDefineStylesByPath = (blockName: string[], styles?: ModuleDefineThemeCleanedSetting[]): ModuleObject => {
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
