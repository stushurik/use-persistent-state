import { useCallback, useState } from 'react';

import { DataType, SchemaFromData, InferFromSchema, Storage } from './types';
import { getValues, serialize } from './utils';

type Update<T> = Partial<T> | ((params: T) => Partial<T>);
type UpdateCallback<T> = (upd: Update<T>) => void;

export function usePersistentState<T extends object>(
  schema: SchemaFromData<T>,
  { get, save }: Storage<Extract<keyof T, string>>,
): [T, UpdateCallback<T>];
export function usePersistentState<
  S extends Record<string, DataType<any, unknown>>,
  T extends InferFromSchema<S> = InferFromSchema<S>,
>(
  schema: S & { [K in keyof T]: DataType<T[K], unknown> },
  { get, save }: Storage<keyof T>,
): [T, UpdateCallback<T>] {
  const schemaId = Object.keys(schema).join();

  const [data, __setData] = useState(() => {
    return Object.keys(schema).reduce((acc, key) => {
      const serializedDataChunk = get(key as keyof T);

      acc[key as keyof T] = schema[key].deserialize(serializedDataChunk);

      return acc;
    }, {} as T);
  });

  const setData = useCallback(
    (update: Update<T>) => {
      __setData((old) => {
        const partialParamsAfterUpdate =
          typeof update === 'function' ? update(old) : update;

        const data = {
          ...getValues<T>(schema, { get: () => null }),
          ...partialParamsAfterUpdate,
        };

        save(serialize(schema, data));

        return data;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schemaId],
  );

  return [data, setData];
}
