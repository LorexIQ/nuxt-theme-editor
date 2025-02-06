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

export type APIFetchConfig<R> = {
  responseType?: 'json' | 'blob';
  loader?: UseSwitchClass;
  onlyOffLoader?: boolean;
  addSlash?: boolean;
  withAuthorize?: boolean;

  success?: (res: R) => void;
  error?: (e: any) => void;
  finally?: () => void;
};
export type APIFetchReturn<R> = Promise<R>;

export type APIQuery = string | number;
export type APIParameter = string | number;
export type APIResponseStatus = { status: boolean };
