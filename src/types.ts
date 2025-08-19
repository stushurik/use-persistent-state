export interface ReadonlyStorage<Key = string> {
  get(key: Key): string | null;
}

export interface Storage<Key = string> extends ReadonlyStorage<Key> {
  save(data: object): void;
}

export type DataType<T, D = null> = {
  serialize(value: NonNullable<T>): string;
  deserialize(serializedValue?: string | null | undefined): T | D;
};

export type SchemaFromData<T extends object> = {
  [K in keyof T]: DataType<T[K], T[K]>;
};

export type InferFromSchema<S extends Record<string, DataType<any, unknown>>> =
  {
    [K in keyof S]: S[K] extends DataType<infer U, infer D> ? U | D : never;
  };
