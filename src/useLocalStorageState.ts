import { useCallback, useState } from 'react';

import { DataType, SchemaFromData, InferFromSchema } from './types';
import { usePersistentState } from './usePersistentState';
import { getValues, serialize } from './utils';

export function useLocalStorageState<T extends object>(
  schema: SchemaFromData<T>,
  { key }: { key: string },
): ReturnType<typeof usePersistentState<T>>;
export function useLocalStorageState<
  S extends Record<string, DataType<any, unknown>>,
  T extends InferFromSchema<S> = InferFromSchema<S>,
>(
  schema: S & { [K in keyof T]: DataType<T[K], unknown> },
  { key }: { key: string },
): ReturnType<typeof usePersistentState> {
  const [parsed, setParsed] = useState<Record<keyof T, string | undefined>>(
    () => {
      return JSON.parse(
        localStorage.getItem(key) ??
          JSON.stringify(useLocalStorageState.RESET_VALUE),
      );
    },
  );

  const get = useCallback(
    (key: keyof T) => (parsed[key] ? String(parsed[key]) : null),
    [parsed],
  );

  const save = useCallback(
    (data: Record<keyof T, string | undefined>) => {
      setParsed(data);
      localStorage.setItem(key, JSON.stringify(data));
    },
    [setParsed, key],
  );

  return usePersistentState(schema, {
    get,
    save,
  });
}

useLocalStorageState.RESET_VALUE = {};

export function getPersistedValues<T extends object>(
  schema: SchemaFromData<T>,
  { key }: { key: string },
): T;
export function getPersistedValues<
  S extends Record<string, DataType<any>>,
  T extends InferFromSchema<S> = InferFromSchema<S>,
>(schema: S & { [K in keyof T]: DataType<T[K]> }, { key }: { key: string }): T {
  const dataInLocalStorage = localStorage.getItem(key);
  const parsed = dataInLocalStorage ? JSON.parse(dataInLocalStorage) : {};

  return getValues<T>(schema, { get: (schemaKey) => parsed[schemaKey] });
}

export function persistValues<T extends object>(
  schema: SchemaFromData<T>,
  data: T,
  { key }: { key: string },
): void;
export function persistValues<
  S extends Record<string, DataType<any>>,
  T extends InferFromSchema<S> = InferFromSchema<S>,
>(
  schema: S & { [K in keyof T]: DataType<T[K]> },
  data: T,
  { key }: { key: string },
): void {
  localStorage.setItem(key, JSON.stringify(serialize<T>(schema, data)));
}
