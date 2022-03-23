import { useEffect } from 'react';
import useLast from '../use-last';

export default function useUnmount(fn: () => void) {
  if (typeof fn !== 'function') {
    throw new Error('useUnmount payload must be function');
  }
  const fnLast = useLast(fn);

  useEffect(() => {
    return () => fnLast();
  }, []);
}
