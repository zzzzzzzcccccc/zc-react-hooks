import { useEffect, useReducer, useState } from 'react';

export enum PromiseStatus {
  Pending,
  Done,
  Error,
}

export enum PromiseStateActionType {
  PromiseInit = 'PromiseInit',
  PromiseDone = 'PromiseDone',
  PromiseError = 'PromiseError',
}

export interface PromiseState<T = undefined> {
  status: PromiseStatus;
  data: T;
  error: Error | null | unknown;
}

export type PromiseStateAction<T> =
  | { type: PromiseStateActionType.PromiseInit }
  | { type: PromiseStateActionType.PromiseDone; payload: T }
  | { type: PromiseStateActionType.PromiseError; payload: Error | null | unknown };

export default function usePromise<T = undefined>(initialPromise: () => Promise<T>, initialData: T) {
  const [time, setTime] = useState(Date.now());
  const [state, dispatch] = useReducer(stateReducer, {
    status: PromiseStatus.Pending,
    data: initialData,
    error: null,
  });

  const run = () => {
    setTime(() => Date.now());
  };

  useEffect(() => {
    let runCancel = false;

    const run = async () => {
      try {
        dispatch({ type: PromiseStateActionType.PromiseInit });
        const result = await initialPromise();
        if (!runCancel) {
          dispatch({ type: PromiseStateActionType.PromiseDone, payload: result });
        }
      } catch (e) {
        if (!runCancel) {
          dispatch({ type: PromiseStateActionType.PromiseError, payload: e });
        }
      }
    };

    run();

    return () => {
      runCancel = true;
    };
  }, [time]);

  return { state, run };
}

function stateReducer<T>(state: PromiseState<T>, action: PromiseStateAction<T>) {
  switch (action.type) {
    case PromiseStateActionType.PromiseInit:
      return { ...state, status: PromiseStatus.Pending, error: null };
    case PromiseStateActionType.PromiseDone:
      return { ...state, status: PromiseStatus.Done, data: action.payload };
    case PromiseStateActionType.PromiseError:
      return { ...state, status: PromiseStatus.Error, error: action.payload };
    default:
      return state;
  }
}
