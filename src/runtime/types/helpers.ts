export type ModuleHelpersNestedKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}` | `${K & string}.${ModuleHelpersNestedKeys<T[K]>}`
        : never;
    }[keyof T]
  : never;
export type ModuleHelpersStringKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends string
        ? `${K & string}`
        : T[K] extends object
          ? `${K & string}.${ModuleHelpersStringKeys<T[K]>}`
          : never;
    }[keyof T]
  : never;
export type ModuleHelpersGetValueByPath<T, P extends ModuleHelpersNestedKeys<T> | ModuleHelpersStringKeys<T>> =
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      // @ts-ignore
      ? ModuleHelpersGetValueByPath<T[K], Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never;

export type ModuleLoadTsModuleBaseReturn = {
  clearTemp: () => void;
  timestamp: number;
  module?: any;
};

export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? DeepRequired<T[K]>
    : T[K];
};
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>
    : T[K];
};
