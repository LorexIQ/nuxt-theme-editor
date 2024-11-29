import type { ModuleOptionsExtend } from '../types';
import { Client } from '../classes/client/Client';
import { useRuntimeConfig, useState } from '#imports';

export default function () {
  const moduleConfig = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  return useState(moduleConfig.keys.state, () => new Client());
}
