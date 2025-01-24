import { $fetch } from 'ofetch';
import type {
  APIFetchConfig,
  APIFetchConfigParams,
  APIFetchDefaultStructBody,
  APIFetchDefaultStructForMethodWithBody,
  APIFetchReturn,
  APIStruct
} from '../../types';
import utils from '../utils';
import useSwitch from './useSwitch';

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

export default function<MapOfMethods extends APIStruct>(url: string, defaultConfig?: APIFetchConfigParams) {
  const _defaultConfig: Required<APIFetchConfigParams> = {
    responseType: 'json',
    loader: useSwitch(),
    onlyOffLoader: false,
    authorization: false,
    addSlash: false,

    ...defaultConfig
  };

  return async function<
    Method extends keyof MapOfMethods,
    Path extends keyof MapOfMethods[Method],
    Options extends Omit<MapOfMethods[Method][Path], 'response'>,
    // @ts-ignore
    Res extends MapOfMethods[Method][Path]['response']
  >(
    method: Method,
    path: Path,
    options: Options,
    config?: APIFetchConfig<any>
  ): APIFetchReturn<Res> {
    const _config: Required<APIFetchConfig<Res>> = {
      ..._defaultConfig,

      success: () => {},
      error: () => {},
      finally: () => {},

      ...config
    };

    const typedOptions = options as Omit<APIFetchDefaultStructForMethodWithBody, 'response'>;
    const typedPath = path as string;

    const authToken = _config.authorization ? _config.authorization : null;

    if (Array.isArray(_config.loader)) {
      _config.loader.map(loader => loader.show(!_config.onlyOffLoader));
    } else {
      _config.loader.show(!_config.onlyOffLoader);
    }

    return new Promise((resolve, reject) => {
      $fetch<Res>(
        `${url}/${preparePath(typedPath, typedOptions.params)}${_config.addSlash ? '/' : ''}`,
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
}
