import { DataType } from './types';

export const createDataTypeCtr = <T, ExtraOptions extends object = {}>(
  impl: (options?: { defaultValue?: T } & ExtraOptions) => DataType<T, any>,
) => {
  function $DataType(): DataType<T, null>;
  function $DataType(
    options: { defaultValue: T } & ExtraOptions,
  ): DataType<T, T>;
  function $DataType(
    options?: { defaultValue?: T } & ExtraOptions,
  ): DataType<T, any> {
    return impl(options);
  }

  return $DataType;
};

export const $String = createDataTypeCtr<string>((options) => {
  if (options?.defaultValue !== undefined) {
    return {
      serialize: String,
      deserialize: (serializedValue) =>
        serializedValue ? serializedValue : options.defaultValue,
    };
  }

  return {
    serialize: String,
    deserialize: (serializedValue) =>
      serializedValue ? serializedValue : null,
  };
});

const defaultDelimiter = '*___delimiter___*';

export const $StringArray = createDataTypeCtr<string[], { delimiter?: string }>(
  (options) => {
    const delimiter = options?.delimiter ?? defaultDelimiter;

    const serialize = (value: string[]) => value.join(delimiter);

    if (options?.defaultValue !== undefined) {
      return {
        serialize,
        deserialize: (serializedValue) =>
          serializedValue
            ? serializedValue.split(delimiter)
            : options.defaultValue,
      };
    }

    return {
      serialize,
      deserialize: (serializedValue) =>
        serializedValue ? serializedValue.split(delimiter) : null,
    };
  },
);

export const $Number = createDataTypeCtr<number>((options) => {
  if (options?.defaultValue !== undefined) {
    return {
      serialize: String,
      deserialize: (serializedValue) =>
        serializedValue ? parseFloat(serializedValue) : options.defaultValue,
    };
  }

  return {
    serialize: String,
    deserialize: (serializedValue) =>
      serializedValue ? parseFloat(serializedValue) : null,
  };
});

export const $NumberArray = createDataTypeCtr<number[]>((options) => {
  const serialize = (value: number[]) => {
    return value.join();
  };

  if (options?.defaultValue !== undefined) {
    return {
      serialize,
      deserialize: (serializedValue) =>
        serializedValue
          ? serializedValue.split(',').map(parseFloat)
          : options.defaultValue,
    };
  }

  return {
    serialize,
    deserialize: (serializedValue) =>
      serializedValue ? serializedValue.split(',') : null,
  };
});

export const $Boolean = createDataTypeCtr<boolean>((options) => {
  if (options?.defaultValue !== undefined) {
    return {
      serialize: String,
      deserialize: (serializedValue) =>
        serializedValue ? serializedValue === 'true' : options.defaultValue,
    };
  }

  return {
    serialize: String,
    deserialize: (serializedValue) =>
      serializedValue ? serializedValue === 'true' : null,
  };
});
