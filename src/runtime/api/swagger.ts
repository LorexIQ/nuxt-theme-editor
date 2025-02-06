import type {
  APIParameter, APIResponseStatus,
  ModuleLocalStorageTheme,
  ModuleLocalStorageThemeCreate,
  ModuleLocalStorageThemeEdit,
  ModuleLocalStorageThemeMini, ModuleLocalStorageThemeTimestamp
} from '../types';

export type ModuleAPISwagger = {
  GET: {
    '/': {
      response: ModuleLocalStorageThemeMini[];
    };
    '/{id}': {
      response: ModuleLocalStorageThemeMini;
      params: {
        id: APIParameter;
      };
    };
    '/full/{id}': {
      response: ModuleLocalStorageTheme;
      params: {
        id: APIParameter;
      };
    };
  };
  POST: {
    '/': {
      response: ModuleLocalStorageTheme;
      body: ModuleLocalStorageThemeCreate;
    };
    '/check-conflict/{id}': {
      response: APIResponseStatus;
      params: {
        id: APIParameter;
      };
      body: ModuleLocalStorageThemeTimestamp;
    };
  };
  PUT: {
    '/{id}': {
      response: ModuleLocalStorageTheme;
      body: ModuleLocalStorageThemeEdit;
      params: {
        id: APIParameter;
      };
    };
  };
  DELETE: {
    '/{id}': {
      response: ModuleLocalStorageTheme;
      params: {
        id: APIParameter;
      };
    };
  };
};
