import { useEffect, useState } from 'react';

export type BehaviorSubjectObservable<T> = {
  subscribe: (listener: (v: T) => void) => {
    unsubscribe: () => void;
  };
};

export default function useObservable<T>(
  observable$: BehaviorSubjectObservable<T>,
  initialValue: T | undefined = undefined,
): [T | undefined] {
  const [value, setValue] = useState<T | undefined>(initialValue);

  useEffect(() => {
    const currentObservable$ = observable$.subscribe(setValue);
    return () => {
      currentObservable$.unsubscribe();
    };
  }, [observable$]);

  return [value];
}
