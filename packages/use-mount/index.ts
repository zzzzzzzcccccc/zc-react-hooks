import { useEffect } from 'react';
import useLast from '../use-last';

export default function useMount(fn: () => void) {
  if (typeof fn !== 'function') {
    throw new Error('useMount must be a function');
  }
  const fnLast = useLast(fn);

  useEffect(() => {
    fnLast();
  }, []);
}
