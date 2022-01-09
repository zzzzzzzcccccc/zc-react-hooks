import { useState } from 'react';
import useNextEffect from '../use-next-effect';
import { isFunction } from '../utils'

export interface Patch<T> {
  (prevState?: T): T;
}

export default function useLocalState<State>(key: string, initialState?: State) {
  if (!key || typeof key !== 'string') {
    throw new Error('key must be string')
  }

  const getLocalState = () => {
    try {
      const sessionData = localStorage.getItem(key)
      if (sessionData) {
        return JSON.parse(sessionData) as State
      }
    } catch (e) {
      console.log(e)
    }
    return initialState ?? undefined
  }

  const [state, setState] = useState<State | undefined>(() => getLocalState());

  const _setState = (payload?: State | Patch<State>) => {
    if (typeof payload === 'undefined') {
      setState(undefined)
      localStorage.removeItem(key)
    } else if (isFunction<Patch<State>>(payload)) {
      try {
        let currentState = payload(state);
        setState(payload)
        localStorage.setItem(key, JSON.stringify(currentState))
      } catch (e) {
        console.log(e)
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
