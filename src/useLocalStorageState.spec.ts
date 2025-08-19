import { renderHook, RenderHookResult } from '@testing-library/react';

import { $Number } from './dataTypes';
import { useLocalStorageState } from './useLocalStorageState';

// function getRandomInt(min: number, max: number) {
//   return Math.floor(
//     Math.random() * (Math.floor(max) - Math.ceil(min + 1)) + Math.ceil(min + 1),
//   );
// }

describe('useLocalStorageState', () => {
  let key = String(Math.random());
  let storage: ReturnType<typeof createMockStorage>;

  let hookResult: RenderHookResult<
    ReturnType<typeof useLocalStorageState<any>>,
    Parameters<typeof useLocalStorageState<any>>
  >;

  // const initState = () => {
  //   const newState = {
  //     paramA: getRandomInt(0, 100),
  //     paramB: getRandomInt(0, 100),
  //   };

  //   act(() => {
  //     hookResult.result.current[1](newState);
  //   });

  //   act(() => {
  //     jest.runAllTimers();
  //   });

  //   return newState;
  // };

  beforeAll(() => {
    storage = createMockStorage();

    Object.defineProperty(window, 'localStorage', {
      value: storage,
    });

    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should correctly init state from local storage even if it doesnt exist yet', () => {
    const a = Math.random();
    const b = Math.random();

    hookResult = renderHook(() =>
      useLocalStorageState(
        {
          paramA: $Number({ defaultValue: a }),
          paramB: $Number({ defaultValue: b }),
        },
        { key },
      ),
    );

    expect(hookResult.result.current[0]).toEqual({
      paramA: a,
      paramB: b,
    });
  });
});

function createMockStorage() {
  let storage: Record<string, string> = {};

  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      storage = {};
    },
  };
}
