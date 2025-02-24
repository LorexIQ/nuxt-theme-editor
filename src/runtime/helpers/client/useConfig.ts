import type { ModuleOptionsExtend } from '../../types';
import { useRuntimeConfig, useState } from '#imports';

export default function (): ModuleOptionsExtend {
  return useState('TE_INNER_CONFIG_STATE', () => useRuntimeConfig().public.themesEditor as unknown as ModuleOptionsExtend).value;
}
