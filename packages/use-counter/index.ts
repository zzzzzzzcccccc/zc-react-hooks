import { useState } from 'react';

export interface Options {
  min?: number | undefined;
  max?: number | undefined;
}

export interface Methods {
  reset: () => void;
  acc: (delta?: number) => void;
  sub: (delta?: number) => void;
  setCurrent: (payload: number | ((p: number) => number)) => void;
}

const initialOptions = {
  max: undefined,
  min: undefined,
};

export default function useCounter(initialValue: number = 0, options: Options = initialOptions): [number, Methods] {
  const [currentNum, setCurrentNum] = useState(() => getNumByOptions(initialValue, options));

  const setHookCurrentNum = (payload: number | ((p: number) => number)) => {
    setCurrentNum((prev) => {
      const target = typeof payload === 'number' ? payload : payload(prev);
      return getNumByOptions(target, options);
    });
  };

  const reset: Methods['reset'] = () => {
    setHookCurrentNum(initialValue);
  };

  const acc: Methods['acc'] = (delta: number = 1) => {
    setHookCurrentNum((prev) => prev + delta);
  };

  const sub: Methods['sub'] = (delta: number = 1) => {
    setHookCurrentNum((prev) => prev - delta);
  };

  const setCurrent: Methods['setCurrent'] = (payload: number | ((p: number) => number)) => {
    setHookCurrentNum(payload);
  };

  return [
    currentNum,
    {
      reset,
      acc,
      sub,
      setCurrent,
    },
  ];
}

function getNumByOptions(val: number, options: Options) {
  const { min, max } = options;
  let target = val;
  if (typeof max === 'number') {
    target = Math.min(max, target);
  }
  if (typeof min === 'number') {
    target = Math.max(min, target);
  }
  return target;
}
