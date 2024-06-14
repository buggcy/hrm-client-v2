import { useEffect, useState } from 'react';

export function usePersistentState<T>(key: string, initialState?: T) {
  const prefixedKey = 'use-persistent-state-' + key;
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(prefixedKey);
    try {
      if (storedValue === null || storedValue === 'undefined') {
        if (typeof initialState === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return initialState();
        } else {
          return initialState;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error(error);
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [value, prefixedKey]);

  return [value, setValue] as const;
}
