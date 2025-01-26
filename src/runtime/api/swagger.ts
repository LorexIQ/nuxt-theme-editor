import type { ModuleLocalStorageTheme, ModuleLocalStorageThemeEdit, ModuleLocalStorageThemeMini } from '..//types';

export type ModuleAPISwagger = {
  GET: {
    '/': {
      response: ModuleLocalStorageThemeMini[];
    };
    '/{id}': {
      response: ModuleLocalStorageTheme;
      params: {
        id: string | number;
      };
    };
  };
  POST: {
    '/': {
      response: ModuleLocalStorageTheme;
      body: ModuleLocalStorageTheme;
    };
  };
  PUT: {
    '/{id}': {
      response: ModuleLocalStorageTheme;
      body: ModuleLocalStorageThemeEdit;
      params: {
        id: string | number;
      };
    };
  };
  DELETE: {
    '/{id}': {
      response: ModuleLocalStorageTheme;
      params: {
        id: string | number;
      };
    };
  };
};
