import type { ModuleDefineThemeBlockRootReturn, ModuleDefineThemeBlockStyles, ModuleDefineThemeMeta } from '../types';
import defineThemeBlock from './defineThemeBlock';

export default function (meta: ModuleDefineThemeMeta, styles: ModuleDefineThemeBlockStyles[]): ModuleDefineThemeBlockRootReturn {
  const object = defineThemeBlock('global', styles);

  return {
    ...object,
    id: 'global',
    meta,
    type: 'defineThemeBlockRoot'
  };
}
