import type { ModuleDefineThemeBlockRootReturn, ModuleDefineThemeBlockSetting, ModuleDefineThemeMeta } from '../types';
import defineThemeBlock from './defineThemeBlock';

export default function (meta: ModuleDefineThemeMeta, styles: ModuleDefineThemeBlockSetting[]): ModuleDefineThemeBlockRootReturn {
  const object = defineThemeBlock('global', styles);

  return {
    ...object,
    id: 'global',
    meta,
    type: 'defineThemeBlockRoot'
  };
}
