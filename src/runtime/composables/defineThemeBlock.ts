import type {
  ModuleDefineThemeBlockReturn,
  ModuleDefineThemeBlockSetting
} from '../types';
import pipe from '../helpers/pipe';

function isStyleDefine(style: ModuleDefineThemeBlockSetting) {
  return ['defineThemeBlockRoot', 'defineThemeBlock'].includes(style.type);
}

function filterStyles(styles: ModuleDefineThemeBlockSetting[]) {
  return styles.filter((style) => {
    if (isStyleDefine(style)) {
      if (['', 'global'].includes(style.id)) {
        if (import.meta.client) console.warn('The use of the id \'global\' or \'\' in defineThemeBlock is not allowed!');
        return false;
      }
      return true;
    }

    return !style.type;
  });
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

export default function (id: string, ...styles: ModuleDefineThemeBlockSetting[]): ModuleDefineThemeBlockReturn {
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
