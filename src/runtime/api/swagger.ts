import type {
  ModuleLocalStorageTheme,
  ModuleLocalStorageThemeCreate,
  ModuleLocalStorageThemeEdit,
  ModuleLocalStorageThemeMini
} from '../types';

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
      body: ModuleLocalStorageThemeCreate;
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
