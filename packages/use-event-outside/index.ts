import { useEffect } from 'react';
import { getElement } from '../utils';
import { Target } from '../utils/getElement';

export type OnEvent<T> = (e: T) => void;
export type Events = string[];

export default function useEventOutside<E extends Event>(
  targets: Target<HTMLElement>[],
  events: Events,
  onEvent?: OnEvent<E>,
) {
  const handleOnEvent = (e: any) => {
    const hasTarget = targets.some((target) => {
      const dom = getElement(target);
      return !dom || dom?.contains(e.target);
    });
    if (!hasTarget) {
      onEvent?.(e);
    }
  };

  useEffect(() => {
    if (!events || events.length <= 0) {
      return;
    }

    events.forEach((event) => document.addEventListener(event, handleOnEvent));

    return () => {
      events.forEach((event) => document.removeEventListener(event, handleOnEvent));
    };
  }, [targets, events]);
}
