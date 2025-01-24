import type { FetchError } from 'ofetch';
import type { UseSwitchClass } from '../helpers/client/useSwitch';

export type APIFetchDefaultStructBody<T = any> = {
  [param: string]: T;
};
export type APIFetchDefaultStructForMethod = {
  response: any;
  params?: { [name: string]: APIParameter };
  query?: Partial<{ [name: string]: APIQuery }>;
};
export type APIFetchDefaultStructForMethodWithBody<T = any> = APIFetchDefaultStructForMethod & {
  body?: APIFetchDefaultStructBody<T>;
};

export type APIFetchConfigParams = {
  responseType?: 'json' | 'blob';
  loader?: UseSwitchClass | UseSwitchClass[];
  onlyOffLoader?: boolean;
  authorization?: string | false;
  addSlash?: boolean;
};
export type APIFetchConfig<R> = APIFetchConfigParams & {
  success?: (res: R) => void;
  error?: (e: any) => void;
  finally?: () => void;
};
export type APIFetchReturn<R> = Promise<R>;

export type APIStruct = {
  GET?: { [name: string]: APIFetchDefaultStructForMethod };
  POST?: { [name: string]: APIFetchDefaultStructForMethodWithBody };
  PUT?: { [name: string]: APIFetchDefaultStructForMethodWithBody };
  PATCH?: { [name: string]: APIFetchDefaultStructForMethodWithBody };
  DELETE?: { [name: string]: APIFetchDefaultStructForMethod };
};

export type APIQuery = string | number;
export type APIParameter = string | number;
export type APIEmpty = NonNullable<unknown>;
export type APIPagination<T> = {
  count: number;
  results: T[];
};
export type APIFetchError = FetchError;
