import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import type { ModuleLocalStorageThemeEdit, ModuleLocalStorageThemeFull } from '../../types';

type ModuleFetchSwagger = {
  GET: {
    '/': {
      response: ModuleLocalStorageThemeFull[];
    };
    '/:id': {
      response: ModuleLocalStorageThemeFull;
      params: {
        id: string | number;
      };
    };
  };
  POST: {
    '/': {
      response: ModuleLocalStorageThemeFull;
      body: ModuleLocalStorageThemeFull;
    };
  };
  PUT: {
    '/:id': {
      response: ModuleLocalStorageThemeFull;
      body: ModuleLocalStorageThemeEdit;
      params: {
        id: string | number;
      };
    };
  };
  DELETE: {
    '/:id': {
      response: ModuleLocalStorageThemeFull;
      params: {
        id: string | number;
      };
    };
  };
};
type ModuleFetchMethod = keyof ModuleFetchSwagger;

export default function<
  Method extends ModuleFetchMethod,
  Path extends keyof ModuleFetchSwagger[Method],
  Args extends ModuleFetchSwagger[Method][Path]
>(method: Method, path: Path, options: Omit<NitroFetchOptions<NitroFetchRequest>, 'method'> & Omit<Args, 'response'>) {
  // @ts-ignore
  return $fetch<Args['response']>('/te-api/themes' + (path as any), {
    ...options as any,
    method
  });
}
