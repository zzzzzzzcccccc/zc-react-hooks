import { useEffect } from 'react';
import { isPlainObject } from 'lodash';

export type Callback<T> = (payload?: T) => void;
export type TriggerWindow<T> = (payload?: T) => void;

export const defaultKey = '__useTriggerWindow__';

export default function useTriggerWindow<T extends Object>(
  fn: Callback<T>,
  key: string = defaultKey,
): [TriggerWindow<T>] {
  const triggerWindow: TriggerWindow<T> = (payload) => {
    if (payload && !isPlainObject(payload)) {
      throw new Error('useTriggerWindow triggerWindow payload not Plain Object');
    }
    const noticeData = { message: payload, triggerTime: Date.now() };
    sessionStorage.setItem(key, JSON.stringify(noticeData));
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key !== key) return;
    try {
      const sessionData = JSON.parse(e.newValue || '');
      fn(sessionData?.message);
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return [triggerWindow];
}
