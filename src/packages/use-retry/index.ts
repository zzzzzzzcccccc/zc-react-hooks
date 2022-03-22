import { useState, useRef } from 'react';

export type Task<T> = () => Promise<T>;
export interface Options<T> {
  count: number;
  onResolved?: (result: T, currentRetryCount: number) => void;
  onRejected?: (error: unknown, currentRetryCount: number) => void;
}

export default function useRetry<T>(task: Task<T>, options: Options<T>): [Task<T>, boolean, any[]] {
  const { count = 3, onResolved, onRejected } = options;
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState<any[]>([]);
  const retryCountRef = useRef(count);
  const retriedCountRef = useRef(0);

  if (count <= 0) throw new Error('useRetry count <= 0');

  const clear = () => {
    setLoading(false);
    retriedCountRef.current = 0;
    retryCountRef.current = count;
  };

  const addError = (e: any) => setErrorList([...errorList, e]);

  const clearError = () => setErrorList([]);

  const runTasks: Task<T> = async () => {
    if (retriedCountRef.current <= 0) clearError();
    retriedCountRef.current++;
    setLoading(true);
    try {
      const result = await task();
      onResolved?.(result, retryCountRef.current);
      clear();
      return result;
    } catch (e) {
      addError(e);
      onRejected?.(e, retriedCountRef.current);
      if (retriedCountRef.current >= retryCountRef.current) {
        clear();
        return Promise.reject(e);
      } else {
        return await runTasks();
      }
    }
  };

  return [runTasks, loading, errorList];
}
