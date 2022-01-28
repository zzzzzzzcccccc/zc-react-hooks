import { useState } from 'react';
import useNextEffect from '../use-next-effect';

type SetState<State> = (
  state: State | undefined | ((prevState?: State) => State)
) => void;

export default function useLocalState<State>(key: string, initialState?: State): [State | undefined, SetState<State>] {
  if (!key || typeof key !== 'string') {
    throw new Error('useLocalState key must be string')
  }

  const getLocalState = () => {
    try {
      const sessionData = localStorage.getItem(key)
      if (sessionData) {
        return JSON.parse(sessionData) as State
      }
    } catch (e) {
      console.error(e)
    }
    return initialState ?? undefined
  }

  const [state, setState] = useState<State | undefined>(() => getLocalState());

  const _setState: SetState<State> = (payload) => {
    if (typeof payload === 'undefined') {
      setState(undefined)
      localStorage.removeItem(key)
    } else if (payload instanceof Function) {
      try {
        let currentState = payload(state);
        setState(payload)
        localStorage.setItem(key, JSON.stringify(currentState))
      } catch (e) {
        console.error(e)
      }
    } else {
      try {
        setState(payload)
        localStorage.setItem(key, JSON.stringify(payload))
      } catch (e) {
        console.error(e)
      }
    }
  }

  useNextEffect(() => {
    setState(getLocalState());
  },[key]);

  return [
    state,
    _setState
  ]
}
