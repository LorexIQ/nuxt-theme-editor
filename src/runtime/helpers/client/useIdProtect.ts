import useConfig from './useConfig';

export default function (id: string | number) {
  const moduleConfig = useConfig();
  const systemUUID = moduleConfig.systemUUID;
  return `${systemUUID}-${id}`;
}
