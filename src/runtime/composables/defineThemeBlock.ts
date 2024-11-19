import type { ModuleDefineThemeBlockReturn, ModuleDefineThemeBlockSetting, ModuleObject } from '../types';
import pipe from '../helpers/pipe';

function filterStyles(styles: ModuleDefineThemeBlockSetting[]) {
  return styles.filter(style => (style.type === 'defineThemeBlock' && style.styles) || !style.type);
}

function unzipStyles(prefix: string, styles: ModuleDefineThemeBlockSetting[]) {
  return styles.map((style) => {
    const isPrefix = prefix.length;
    return Object
      .entries((style.type === 'defineThemeBlock' ? style.styles : style) as ModuleObject)
      .reduce((accum, style) => {
        const keyWithPrefix = `${prefix}${isPrefix ? style[0][0].toUpperCase() + style[0].slice(1) : style[0]}`;
        return {
          ...accum,
          [keyWithPrefix]: style[1]
        };
      }, {} as ModuleObject);
  });
}

function flatStyles(styles: ModuleObject[]) {
  return styles.reduce((accum, style) => ({ ...accum, ...style }), {} as ModuleObject);
}

export default function (prefix: string | undefined | null, ...styles: ModuleDefineThemeBlockSetting[]): ModuleDefineThemeBlockReturn {
  if (!prefix) prefix = '';

  return {
    type: 'defineThemeBlock',
    prefix,
    styles: pipe(
      styles,
      filterStyles,
      unzipStyles.bind(null, prefix),
      flatStyles
    )
  };
}
