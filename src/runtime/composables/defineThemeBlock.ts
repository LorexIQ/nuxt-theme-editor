import type {
  ModuleDefineThemeBlockReturn,
  ModuleDefineThemeBlockSettings,
  ModuleDefineThemeBlockStyles
} from '../types';
import pipe from '../helpers/pipe';
import defineChecker from '../helpers/defineChecker';

function filterStyles(styles: ModuleDefineThemeBlockStyles[]) {
  return styles.filter((style) => {
    if (defineChecker(style)) {
      if (['', 'global'].includes(style.id)) {
        console.warn('The use of the id \'global\' or \'\' in defineThemeBlock is not allowed!');
        return false;
      }
      return true;
    }

    return !style.type;
  });
}

function mergeSelfStyles(styles: ModuleDefineThemeBlockStyles[]) {
  const selfStyles = styles
    .filter(style => !defineChecker(style))
    .reduce((accum, style) => {
      const filteredStyles = Object
        .keys(style)
        .filter(sKey => !['id', 'styles', 'type'].includes(sKey.toLowerCase()))
        .reduce((accum, sKey) => ({ ...accum, [sKey]: (style as any)[sKey] }), {});
      return { ...accum, ...filteredStyles };
    }, {});
  const defineStyles = styles
    .filter(style => defineChecker(style));
  return [selfStyles, ...defineStyles];
}

function sortStyles(styles: ModuleDefineThemeBlockStyles[]) {
  return styles.sort((a, b) => defineChecker(a)
    ? defineChecker(b)
      ? a.id.localeCompare(b.id)
      : 1
    : -1
  );
}

export default function (id: string, styles: ModuleDefineThemeBlockStyles[], settings?: Partial<ModuleDefineThemeBlockSettings>): ModuleDefineThemeBlockReturn {
  return {
    id,
    type: 'defineThemeBlock',
    styles: pipe(
      styles,
      filterStyles,
      mergeSelfStyles,
      sortStyles
    ),
    settings: {
      name: '',
      inheritanceParent: false,

      ...settings
    }
  };
}
