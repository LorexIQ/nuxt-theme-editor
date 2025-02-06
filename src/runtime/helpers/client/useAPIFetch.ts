import { $fetch } from 'ofetch';
import type { ModuleAPISwagger } from '../../api';
import utils from '../utils';
import type {
  APIFetchConfig,
  APIFetchDefaultStructBody,
  APIFetchDefaultStructForMethodWithBody,
  APIFetchReturn, ModuleOptionsExtend
} from '../../types';
import useSwitch from './useSwitch';
import { useRuntimeConfig, useState } from '#imports';

function preparePath(path: string, params?: APIFetchDefaultStructBody): string {
  if (params) {
    let newPath = path;

    for (const param in params) {
      newPath = newPath.replace(`{${param}}`, params[param]);
    }

    return utils.trimStr(newPath, '/');
  }

  return utils.trimStr(path, '/');
}
function getOrigin(runtimeConfig: ModuleOptionsExtend) {
  const globalConfig = runtimeConfig.themesConfig.global;

  switch (globalConfig.mode) {
    case 'nodeLocalStorage':
      return '/te-api/themes';
    case 'customAPI':
      return globalConfig.origin;
  }
}
function getAuthorizationToken(runtimeConfig: ModuleOptionsExtend): string | undefined {
  const globalConfig = runtimeConfig.themesConfig.global;

  switch (globalConfig.mode) {
    case 'customAPI':
      if (globalConfig.authorizationUseStateKey) return useState<string>(globalConfig.authorizationUseStateKey).value;
      break;
    case 'nodeLocalStorage': {
      const isFullAccess = globalConfig.editingAllowedUseStateKey ? useState<boolean>(globalConfig.editingAllowedUseStateKey).value : true;
      return runtimeConfig.tokens[isFullAccess ? 'fullAuthorizationToken' : 'baseAuthorizationToken'];
    }
  }
}

export default async function useAPIFetch<
  Method extends keyof ModuleAPISwagger,
  Path extends keyof ModuleAPISwagger[Method],
  Options extends Omit<ModuleAPISwagger[Method][Path], 'response'>,
  // @ts-ignore
  Res extends ModuleAPISwagger[Method][Path]['response']
>(
  method: Method,
  path: Path,
  options: Options,
  config?: APIFetchConfig<any>
): APIFetchReturn<Res> {
  const _config: Required<APIFetchConfig<Res>> = {
    responseType: 'json',
    loader: useSwitch(),
    onlyOffLoader: false,
    addSlash: false,
    withAuthorize: true,

    success: () => {},
    error: () => {},
    finally: () => {},

    ...config
  };

  const runtimeConfig = useRuntimeConfig().public.themesEditor as unknown as ModuleOptionsExtend;
  const typedOptions = options as Omit<APIFetchDefaultStructForMethodWithBody, 'response'>;
  const typedPath = path as string;

  const authToken = getAuthorizationToken(runtimeConfig);
  const preparedPath = preparePath(typedPath, typedOptions.params);

  _config.loader.show(!_config.onlyOffLoader);

  return new Promise((resolve, reject) => {
    $fetch<Res>(
      `${getOrigin(runtimeConfig)}/${preparedPath}${_config.addSlash && preparedPath.length ? '/' : ''}`,
      {
        method: method as string,
        query: typedOptions.query ?? {},
        ...(typedOptions.body ? { body: typedOptions.body } : {}),
        headers: {
          ...(authToken ? { Authorization: authToken } : {})
        },
        ...(method === 'GET' ? { responseType: _config.responseType as any } : {})
      }
    )
      .then(async (res) => {
        await _config.loader.hide();
        _config.success(res);
        resolve(res);
      })
      .catch(async (e) => {
        await _config.loader.hide();
        _config.error(e);
        reject(e);
      })
      .finally(() => {
        _config.finally();
      });
  });
};
