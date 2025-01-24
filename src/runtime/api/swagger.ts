import type { ModuleLocalStorageThemeEdit, ModuleLocalStorageThemeFull } from '..//types';

export type ModuleAPISwagger = {
  GET: {
    '/': {
      response: ModuleLocalStorageThemeFull[];
    };
    '/{id}': {
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
    '/{id}': {
      response: ModuleLocalStorageThemeFull;
      body: ModuleLocalStorageThemeEdit;
      params: {
        id: string | number;
      };
    };
  };
  DELETE: {
    '/{id}': {
      response: ModuleLocalStorageThemeFull;
      params: {
        id: string | number;
      };
    };
  };
};
