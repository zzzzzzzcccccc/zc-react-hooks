import { useState, useEffect, useRef } from 'react';
import { RafTimer } from '../utils';

export type CallBack = (intervalCount: number) => void;
export type Paused = () => void;
export type Run = () => void;
export type Reset = () => void;

export default function useRafInterval(
  interval = 1000,
  fn?: CallBack,
): [Run, Paused, Reset, { stop: Boolean; intervalCount: number }] {
  const [intervalCount, setIntervalCount] = useState(0);
  const [stop, setStop] = useState(false);
  const timer = useRef<Symbol | null>();

  const clearTimer = () => {
    if (timer.current) {
      RafTimer.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const run: Run = () => {
    setStop(false);
    timer.current = RafTimer.setInterval(() => {
      setIntervalCount((prev) => {
        const after = prev + 1;
        fn?.(after);
        return after;
      });
    }, interval);
  };

  const paused: Paused = () => {
    clearTimer();
    setStop(true);
  };

  const reset = () => {
    paused();
    setIntervalCount(0);
  };

  useEffect(() => {
    return reset;
  }, []);

  return [
    run,
    paused,
    reset,
    {
      stop,
      intervalCount,
    },
  ];
}
