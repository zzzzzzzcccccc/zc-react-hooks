import { DependencyList, useState, MutableRefObject, useEffect, useRef } from 'react';
import { isArrayLike } from 'lodash';

export type Rect = {
  width: number;
  height: number;
  x: number;
  y: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
};

const initialRect: Rect = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

export default function useRect<T extends HTMLElement>(
  deps: DependencyList,
): [Rect, MutableRefObject<T | null>, () => void] {
  if (!deps || !isArrayLike(deps)) {
    throw new Error('useRect deps must be array');
  }
  const wrapperRef = useRef<T | null>(null);
  const [rect, setRect] = useState<Rect>(initialRect);

  const setCurrentRect = () => {
    const _rect = wrapperRef.current?.getBoundingClientRect();
    if (_rect) {
      setRect(_rect as Rect);
    }
  };

  useEffect(() => {
    setCurrentRect();
  }, deps);

  return [rect, wrapperRef, setCurrentRect];
}
