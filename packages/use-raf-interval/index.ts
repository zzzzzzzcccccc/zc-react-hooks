import { useState, useEffect, useRef } from 'react';
import { RafTimer } from '../utils';

export type CallBack = (intervalCount: number) => void;
export type Paused = () => void;
export type Run = () => void;

export default function useRafInterval(fn?: CallBack, interval = 1000): [number, boolean, Paused, Run] {
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
    clearTimer();
    setStop(false);
    timer.current = RafTimer.setInterval(() => {
      let afterIntervalCount = intervalCount + 1;
      setIntervalCount(afterIntervalCount);
      fn?.(afterIntervalCount);
    }, interval);
  };

  const paused: Paused = () => {
    clearTimer();
    setStop(true);
  };

  useEffect(() => {
    run();
    return paused;
  }, []);

  return [intervalCount, stop, paused, run];
}
