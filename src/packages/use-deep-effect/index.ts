import { DependencyList, EffectCallback, useEffect, useRef } from 'react';
import { isEqual } from 'lodash';

function deepEqual(beforeDeps: DependencyList, afterDeps: DependencyList = []) {
  return isEqual(beforeDeps, afterDeps);
}

export default function useDeepEffect(effect: EffectCallback, deps: DependencyList) {
  const ref = useRef<DependencyList>();
  const diffCountRef = useRef(0);

  if (!deepEqual(deps, ref.current)) {
    ref.current = deps;
    diffCountRef.current += 1;
  }

  useEffect(effect, [diffCountRef.current]);
}
