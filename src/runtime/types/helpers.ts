export type ModuleNestedKeys<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: K | `${K & string}.${ModuleNestedKeys<T[K]>}`;
    }[keyof T]
  : never;

export type ModuleLoadTsModuleBaseReturn = {
  clearTemp: () => void;
  timestamp: number;
  module?: any;
};
