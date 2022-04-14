import { useEffect, DependencyList } from 'react';
import { validGenerator } from '../utils';
import { AsyncCallback } from '../utils/validGenerator';

export default function useAsyncEffect(asyncEffectCallback: () => AsyncCallback, deps: DependencyList) {
  useEffect(() => {
    const doAsyncEffectCallback = asyncEffectCallback();
    let isCancelled = false;

    const handleExecute = async () => {
      if (!validGenerator(doAsyncEffectCallback)) {
        await doAsyncEffectCallback;
      } else {
        while (true) {
          const result = await doAsyncEffectCallback.next();
          if (isCancelled || result.done) {
            break;
          }
        }
      }
    };

    handleExecute();

    return () => {
      isCancelled = true;
    };
  }, deps);
}
