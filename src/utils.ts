import {
  SchemaFromData,
  InferFromSchema,
  DataType,
  ReadonlyStorage,
} from './types';

export function getValues<T extends object>(
  schema: SchemaFromData<T>,
  storage: ReadonlyStorage,
): T;
export function getValues<
  S extends Record<string, DataType<any>>,
  T extends InferFromSchema<S> = InferFromSchema<S>,
>(schema: S & { [K in keyof T]: DataType<T[K]> }, storage: ReadonlyStorage): T {
  const keys = Object.keys(schema);

  return keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: schema[key].deserialize(storage.get(key)),
    }),
    {} as T,
  );
}

export function serialize<T extends object>(
  schema: SchemaFromData<T>,
  data: T,
): Record<keyof T, string | undefined>;
export function serialize<
  S extends Record<string, DataType<any>>,
  T extends InferFromSchema<S> = InferFromSchema<S>,
>(
  schema: S & { [K in keyof T]: DataType<T[K]> },
  data: T,
): Record<keyof T, string | undefined> {
  return Object.keys(schema).reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        data[key] !== undefined ? schema[key].serialize(data[key]) : undefined,
    }),
    {} as Record<keyof T, string | undefined>,
  );
}
