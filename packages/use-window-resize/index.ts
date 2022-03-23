import { useLayoutEffect, useState } from 'react';
import { debounce } from 'lodash';

export type Options = {
  wait: number;
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
  ignoreDebounce?: boolean;
};

export type CallbackFunction = (e: UIEvent) => void;

export interface WindowSize {
  width: number;
  height: number;
}

const initialOptions: Options = {
  wait: 300,
  ignoreDebounce: true,
};

export default function useWindowResize(fn?: CallbackFunction, options: Options = initialOptions): [WindowSize] {
  const { wait, ignoreDebounce, ...rest } = options;
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });

  const listenerResize = (e: UIEvent) => {
    const action = () => {
      fn?.(e);
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    ignoreDebounce ? action() : debounce(action, wait, rest);
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', listenerResize);
    return () => window.removeEventListener('resize', listenerResize);
  }, []);

  return [windowSize];
}
