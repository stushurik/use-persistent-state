import { act, renderHook, RenderHookResult } from '@testing-library/react';

import { $Number } from './dataTypes';
import { Storage } from './types';
import { usePersistentState } from './usePersistentState';

function getRandomInt(min: number, max: number) {
  return Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min + 1)) + Math.ceil(min + 1),
  );
}

describe('usePersistentState', () => {
  let storage: Storage;

  let hookResult: RenderHookResult<
    ReturnType<typeof usePersistentState<any>>,
    Parameters<typeof usePersistentState<any>>
  >;

  const initState = () => {
    const newState = {
      paramA: getRandomInt(0, 100),
      paramB: getRandomInt(0, 100),
    };

    act(() => {
      hookResult.result.current[1](newState);
    });

    act(() => {
      jest.runAllTimers();
    });

    return newState;
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    storage = createMockStorage();

    hookResult = renderHook(() =>
      usePersistentState(
        {
          paramA: $Number({ defaultValue: 0 }),
          paramB: $Number({ defaultValue: 0 }),
        },
        storage,
      ),
    );
  });

  it('should have default state', () => {
    const [state] = hookResult.result.current;

    expect(state).toEqual({ paramA: 0, paramB: 0 });
  });

  it('should allow to fully update state by passing new state', async () => {
    const newState = initState();

    expect(hookResult.result.current[0]).toEqual(newState);
  });

  it('should allow to update state based on previous state', () => {
    const newState = initState();

    act(() => {
      hookResult.result.current[1]((old) => ({
        paramA: old.paramA + 10,
        paramB: old.paramB + 10,
      }));
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(hookResult.result.current[0]).toEqual({
      paramA: newState.paramA + 10,
      paramB: newState.paramB + 10,
    });
  });

  it('should provide updated state by previous update fn if updates are applied multiple times imidiatelly', () => {
    const newState = initState();

    const paramA = getRandomInt(0, 100);
    const paramB = getRandomInt(0, 100);

    act(() => {
      hookResult.result.current[1]((old) => ({
        paramA: old.paramA + paramA,
        paramB: old.paramB + paramB,
      }));
      hookResult.result.current[1]((old) => ({
        paramA: old.paramA + paramA,
        paramB: old.paramB + paramB,
      }));
      hookResult.result.current[1]((old) => ({
        paramA: old.paramA + paramA,
        paramB: old.paramB + paramB,
      }));
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(hookResult.result.current[0]).toEqual({
      paramA: newState.paramA + paramA * 3,
      paramB: newState.paramB + paramB * 3,
    });
  });

  it('should reset state with empty object', () => {
    initState();

    act(() => {
      hookResult.result.current[1]({});
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(hookResult.result.current[0]).toEqual({
      paramA: 0,
      paramB: 0,
    });
  });

  it('should allow partial update', () => {
    initState();

    const paramB = getRandomInt(0, 100);

    act(() => {
      hookResult.result.current[1]({ paramB });
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(hookResult.result.current[0]).toEqual({
      paramA: 0,
      paramB,
    });
  });

  it('should provide default state params if partial updates are applied during multiple imidiate updates', () => {
    const newState = initState();

    const paramA = getRandomInt(0, 100);
    const paramB = getRandomInt(0, 100);

    act(() => {
      hookResult.result.current[1]((old) => ({
        paramA: old.paramA + paramA,
      }));
      hookResult.result.current[1]((old) => ({
        paramA: old.paramA + paramA,
      }));
      hookResult.result.current[1]((old) => ({
        paramA: old.paramA + paramA,
        paramB: old.paramB + paramB,
      }));
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(hookResult.result.current[0]).toEqual({
      paramA: newState.paramA + paramA * 3,
      paramB,
    });
  });
});

function createMockStorage() {
  let storage: { current: Record<string, any> } = {
    current: {},
  };

  return {
    get: jest.fn((key: string) => {
      return storage.current[key];
    }),
    save: jest.fn((params) => {
      storage.current = params;
    }),
  };
}
