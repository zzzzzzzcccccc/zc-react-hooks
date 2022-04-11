import { useCallback, useRef } from 'react';

export default function useAsyncCallback<P extends any[], D extends any>(fn: (...args: P) => Promise<D>) {
  const runningRef = useRef(false);

  return useCallback(
    async (...args: P) => {
      if (runningRef.current) return;

      runningRef.current = true;

      try {
        return await fn(...args);
      } catch (e) {
        throw e;
      } finally {
        runningRef.current = false;
      }
    },
    [fn],
  );
}
