import type { ModuleClient } from '../../types';
import { Client } from '../../classes/client/Client';
import useConfig from './useConfig';
import { useState } from '#imports';

export default function () {
  const moduleConfig = useConfig();
  const client = useState<ModuleClient>(moduleConfig.keys.state);
  if (!client.value) client.value = new Client();
  return client;
}
