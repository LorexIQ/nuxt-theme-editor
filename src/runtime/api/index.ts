import type {
  APIParameter, APIResponseStatus,
  ModuleLocalStorageTheme,
  ModuleLocalStorageThemeCreate,
  ModuleLocalStorageThemeEdit,
  ModuleLocalStorageThemeMini, ModuleLocalStorageThemeTimestamp
} from '../types';

export type ModuleAPISwagger = {
  GET: {
    '/themes/': {
      response: ModuleLocalStorageThemeMini[];
    };
    '/themes/{id}': {
      response: ModuleLocalStorageThemeMini;
      params: {
        id: APIParameter;
      };
    };
    '/themes/full/{id}': {
      response: ModuleLocalStorageTheme;
      params: {
        id: APIParameter;
      };
    };
  };
  POST: {
    '/themes/': {
      response: ModuleLocalStorageTheme;
      body: ModuleLocalStorageThemeCreate;
    };
    '/themes/check-conflict/{id}': {
      response: APIResponseStatus;
      params: {
        id: APIParameter;
      };
      body: ModuleLocalStorageThemeTimestamp;
    };
  };
  PUT: {
    '/themes/{id}': {
      response: ModuleLocalStorageTheme;
      body: ModuleLocalStorageThemeEdit;
      params: {
        id: APIParameter;
      };
    };
  };
  DELETE: {
    '/themes/{id}': {
      response: ModuleLocalStorageTheme;
      params: {
        id: APIParameter;
      };
    };
  };
};
