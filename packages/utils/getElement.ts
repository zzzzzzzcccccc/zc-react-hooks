import { MutableRefObject } from 'react';

export type TargetValue<T> = T | undefined | null;
export type Target<T extends HTMLElement | Element | Window | Document> =
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>;

export default function getElement(target?: Target<Element | Document>) {
  if (!target) {
    return document;
  }

  if ('current' in target) {
    return target.current;
  }

  return target;
}
