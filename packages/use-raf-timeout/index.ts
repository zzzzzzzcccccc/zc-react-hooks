import { useEffect } from 'react';
import { RafTimer } from '../utils';
import { useLast } from '../index';

export default function useRafTimeout(fn: () => void, delay: number = 5000) {
  const lastFn = useLast(fn);

  useEffect(() => {
    if (typeof delay !== 'number' || delay <= 0) {
      throw new Error('useRafTimeout delay number or > 0');
    }
    let timer = RafTimer.setTimeout(() => {
      lastFn();
    }, delay);
    return () => RafTimer.clearTimeout(timer);
  }, [delay]);
}
