import pickBy from 'lodash.pickby';
import { useCallback } from 'react';

import { DataType, SchemaFromData, InferFromSchema } from './types';
import { usePersistentState } from './usePersistentState';
import {
  useSearchParams,
  SetQueryOptions,
  setURLSearchParams,
} from './useSearchParams';
import { getValues, serialize } from './utils';

export function useSearchParamsState<T extends object>(
  schema: SchemaFromData<T>,
  options?: SetQueryOptions,
): ReturnType<typeof usePersistentState<T>>;
export function useSearchParamsState<
  S extends Record<string, DataType<any, unknown>>,
  T extends InferFromSchema<S> = InferFromSchema<S>,
>(
  schema: S & { [K in keyof T]: DataType<T[K], unknown> },
  options?: SetQueryOptions,
): ReturnType<typeof usePersistentState> {
  const [searchParams, setSearchParams] = useSearchParams();

  const save = useCallback(
    (data: Record<keyof T, string | undefined>) => {
      const allParams = [
        ...new URLSearchParams(window.location.search).entries(),
      ];
      const params = allParams.reduce<Record<string, string>>(
        (acc, [key, val]) => {
          acc[key] = val;
          return acc;
        },
        {},
      );

      setSearchParams(pickBy({ ...params, ...data }, Boolean), options);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSearchParams],
  );

  return usePersistentState(schema, {
    get: searchParams.get.bind(searchParams),
    save,
  });
}

export function getPersistedValues<T extends object>(
  schema: SchemaFromData<T>,
): T;
export function getPersistedValues<
  S extends Record<string, DataType<any>>,
  T extends InferFromSchema<S> = InferFromSchema<S>,
>(schema: S & { [K in keyof T]: DataType<T[K]> }): T {
  const aUrlSearchParams = new URLSearchParams(document.location.search);

  return getValues<T>(schema, {
    get: (key) => aUrlSearchParams.get(key as string),
  });
}

export function persistValues<T extends object>(
  schema: SchemaFromData<T>,
  data: T,
  options?: SetQueryOptions,
): void;
export function persistValues<
  S extends Record<string, DataType<any>>,
  T extends InferFromSchema<S> = InferFromSchema<S>,
>(
  schema: S & { [K in keyof T]: DataType<T[K]> },
  data: T,
  options?: SetQueryOptions,
): void {
  setURLSearchParams(serialize(schema, data), options);
}
