import { useEffect } from 'react';

import { $Number, $String } from './src/dataTypes';
import { useLocalStorageState } from './src/useLocalStorageState';
import { useSearchParamsState } from './src/useSearchParamsState';

const Test = () => {
  const [state, setState] = useLocalStorageState<{
    paramA: number;
    paramB?: string;
  }>(
    {
      paramA: $Number({ defaultValue: 0 }),
      paramB: $String(),
    },
    { key: 'test' },
  );

  const [stateURL, setStateURL] = useSearchParamsState({
    paramA: $Number({ defaultValue: 0 }),
    paramB: $String(),
  });

  useEffect(() => {
    setStateURL({
      paramA: 1,
      paramB: '',
    });
  }, []);

  return null;
};

// <{
//     paramA: number;
//     paramB: string;
//   }>
