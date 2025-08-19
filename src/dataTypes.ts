import { DataType } from './types';

export const createDataTypeCtr = <T>(
  impl: (options?: { defaultValue?: T }) => DataType<T, any>,
) => {
  function $DataType(): DataType<T, null>;
  function $DataType(options: { defaultValue: T }): DataType<T, T>;
  function $DataType(options?: { defaultValue?: T }): DataType<T, any> {
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

export const $StringArray = createDataTypeCtr<string[]>((options) => {
  const separator = `*${Math.random()}*`.slice(-4, -1);

  const serialize = (value: string[]) => value.join(separator);

  if (options?.defaultValue !== undefined) {
    return {
      serialize,
      deserialize: (serializedValue) =>
        serializedValue
          ? serializedValue.split(separator)
          : options.defaultValue,
    };
  }

  return {
    serialize,
    deserialize: (serializedValue) =>
      serializedValue ? serializedValue.split(separator) : null,
  };
});

export const $Number = createDataTypeCtr<number>((options) => {
  if (options?.defaultValue !== undefined) {
    return {
      serialize: String,
      deserialize: (serializedValue) =>
        serializedValue ? parseInt(serializedValue, 10) : options.defaultValue,
    };
  }

  return {
    serialize: String,
    deserialize: (serializedValue) =>
      serializedValue ? parseInt(serializedValue, 10) : null,
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
        serializedValue ? serializedValue.split(',') : options.defaultValue,
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
