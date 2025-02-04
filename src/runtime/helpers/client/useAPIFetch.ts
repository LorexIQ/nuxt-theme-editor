import { $fetch } from 'ofetch';
import type { ModuleAPISwagger } from '../../api';
import utils from '../utils';
import type {
  APIFetchConfig,
  APIFetchDefaultStructBody,
  APIFetchDefaultStructForMethodWithBody,
  APIFetchReturn, ModuleOptionsThemesConfigGlobal
} from '../../types';
import useSwitch from './useSwitch';
import { useState } from '#imports';

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
function getOrigin(globalConfig: ModuleOptionsThemesConfigGlobal) {
  switch (globalConfig.mode) {
    case 'nodeLocalStorage':
      return '/te-api/themes';
    case 'customAPI':
      return globalConfig.origin;
  }
}
function getAuthorizationToken(globalConfig: ModuleOptionsThemesConfigGlobal): string | undefined {
  if (globalConfig.mode === 'customAPI') {
    if (globalConfig.authorizationUseStateKey) {
      return useState<string>(globalConfig.authorizationUseStateKey).value;
    }
  }
}

export default async function<
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

    globalConfig: {
      enabled: false,
      mode: 'nodeLocalStorage'
    },

    success: () => {},
    error: () => {},
    finally: () => {},

    ...config
  };

  const typedOptions = options as Omit<APIFetchDefaultStructForMethodWithBody, 'response'>;
  const typedPath = path as string;

  const authToken = getAuthorizationToken(_config.globalConfig);
  const preparedPath = preparePath(typedPath, typedOptions.params);

  if (Array.isArray(_config.loader)) {
    _config.loader.map(loader => loader.show(!_config.onlyOffLoader));
  } else {
    _config.loader.show(!_config.onlyOffLoader);
  }

  return new Promise((resolve, reject) => {
    $fetch<Res>(
      `${getOrigin(_config.globalConfig)}/${preparedPath}${_config.addSlash && preparedPath.length ? '/' : ''}`,
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
        _config.success(res);
        resolve(res);
      })
      .catch((e) => {
        _config.error(e);
        reject(e);
      })
      .finally(() => {
        _config.finally();

        if (Array.isArray(_config.loader)) {
          _config.loader.map(loader => loader.hide());
        } else {
          _config.loader.hide();
        }
      });
  });
};
