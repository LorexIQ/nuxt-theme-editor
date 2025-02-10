import type { ModuleDefineThemeBlockStyles } from '../types';

export default function (
  define: ModuleDefineThemeBlockStyles,
  checkedIds: 'all' | 'root' | 'block' = 'all'
) {
  const ids
    = checkedIds === 'all'
      ? ['defineThemeBlock', 'defineThemeBlockRoot']
      : checkedIds === 'root'
        ? ['defineThemeBlockRoot']
        : ['defineThemeBlock'];

  return !!define.id && ids.includes(define.type as any) && Array.isArray(define.styles);
}
