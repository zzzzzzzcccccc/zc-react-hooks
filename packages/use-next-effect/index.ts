import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

export default function useNextEffect(effect: EffectCallback, deps?: DependencyList) {
  const isNextMounted = useRef(false);

  useEffect(() => {
    if (!isNextMounted.current) {
      isNextMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
}
