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

export type ModuleLoadTsModuleBaseReturn = {
  clearTemp: () => void;
  timestamp: number;
  module?: any;
};
