import type { ModuleClient, ModuleOptionsExtend } from '../../types';
import { Client } from '../../classes/client/Client';
import { useRuntimeConfig, useState } from '#imports';

export default function () {
  const moduleConfig = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  const client = useState<ModuleClient>(moduleConfig.keys.state);
  if (!client.value) client.value = new Client();
  return client;
}
