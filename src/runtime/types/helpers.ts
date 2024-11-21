export type ModuleNestedKeys<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: K | `${K & string}.${ModuleNestedKeys<T[K]>}`;
    }[keyof T]
  : never;
