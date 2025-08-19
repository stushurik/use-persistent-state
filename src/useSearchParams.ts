import { useCallback, useEffect, useMemo, useState } from 'react';

type QueryInit =
  | Record<string, string | number | boolean | null | undefined>
  | string
  | URLSearchParams;

export interface SetQueryOptions {
  replace?: boolean;
}

export function useSearchParams(): [
  URLSearchParams,
  (nextInit: QueryInit, options?: SetQueryOptions) => void,
] {
  const [queryString, setQueryString] = useState(() => window.location.search);

  useEffect(() => {
    const onPopState = () => {
      setQueryString(window.location.search);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const searchParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString],
  );

  const setQuery = useCallback(
    (nextInit: QueryInit, options?: SetQueryOptions) => {
      let nextParams = setURLSearchParams(nextInit, options);

      setQueryString(nextParams);
    },
    [],
  );

  return [searchParams, setQuery];
}

export const setURLSearchParams = (
  nextInit: QueryInit,
  options?: SetQueryOptions,
) => {
  let nextParams: string;

  if (typeof nextInit === 'string') {
    nextParams = nextInit.startsWith('?') ? nextInit : `?${nextInit}`;
  } else if (nextInit instanceof URLSearchParams) {
    nextParams = `?${nextInit.toString()}`;
  } else {
    const params = new URLSearchParams();
    for (const key in nextInit) {
      const value = nextInit[key];
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    nextParams = `?${params.toString()}`;
  }

  const newUrl = `${window.location.pathname}${nextParams}`;
  if (options?.replace) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }

  return nextParams;
};
