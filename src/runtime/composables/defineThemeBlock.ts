import type {
  ModuleDefineThemeBlockReturn,
  ModuleDefineThemeBlockRootReturn,
  ModuleDefineThemeBlockSetting
} from '../types';
import pipe from '../helpers/pipe';

const globalStylesId = 'global';

function isStyleDefine(style: ModuleDefineThemeBlockSetting) {
  return ['defineThemeBlockRoot', 'defineThemeBlock'].includes(style.type);
}

function filterStyles(styles: ModuleDefineThemeBlockSetting[]) {
  return styles.filter(style => isStyleDefine(style) || !style.type);
}

function mergeSelfStyles(styles: ModuleDefineThemeBlockSetting[]) {
  const selfStyles = styles
    .filter(style => !isStyleDefine(style))
    .reduce((accum, style) => ({ ...accum, ...style }), {});
  const defineStyles = styles
    .filter(style => isStyleDefine(style));
  return [selfStyles, ...defineStyles];
}

function sortStyles(styles: ModuleDefineThemeBlockSetting[]) {
  return styles.sort((a, b) => isStyleDefine(a)
    ? isStyleDefine(b)
      ? a.id.localeCompare(b.id)
      : 1
    : -1
  );
}

export function defineThemeBlock(id: string, ...styles: ModuleDefineThemeBlockSetting[]): ModuleDefineThemeBlockReturn {
  return {
    id,
    type: 'defineThemeBlock',
    styles: pipe(
      styles,
      filterStyles,
      mergeSelfStyles,
      sortStyles
    )
  };
}

export function defineThemeBlockRoot(...styles: ModuleDefineThemeBlockSetting[]): ModuleDefineThemeBlockRootReturn {
  const object = defineThemeBlock(globalStylesId, ...styles);

  return {
    ...object,
    type: 'defineThemeBlockRoot'
  };
}
