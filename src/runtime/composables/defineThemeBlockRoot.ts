import type { ModuleDefineThemeBlockRootReturn, ModuleDefineThemeBlockSetting } from '../types';
import defineThemeBlock from './defineThemeBlock';

export default function (...styles: ModuleDefineThemeBlockSetting[]): ModuleDefineThemeBlockRootReturn {
  const object = defineThemeBlock('global', ...styles);

  return {
    ...object,
    type: 'defineThemeBlockRoot'
  };
}
