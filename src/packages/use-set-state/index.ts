import { useState } from 'react';
import { isPlainObject } from 'lodash';

type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void;

export default function useSetState<State extends Record<string, any>>(initialState: State): [State, SetState<State>] {
  if (!isPlainObject(initialState)) throw new Error('initialState not Plain Object');

  const [state, setState] = useState<State>(initialState);

  const _setState: SetState<State> = (payload) =>
    setState((prevState: State) => ({
      ...prevState,
      ...(payload instanceof Function ? payload(prevState) : payload),
    }));

  return [state, _setState];
}
