import type { ModuleOptionsExtend } from '../types';
import { useRuntimeConfig } from '#imports';

export default function (id: string | number) {
  const moduleConfig = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  const systemUUID = moduleConfig.systemUUID;
  return `${systemUUID}-${id}`;
}
