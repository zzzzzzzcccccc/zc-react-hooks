import { useState, MutableRefObject, useRef, useLayoutEffect } from 'react';

export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export type TargetValue<T> = T | undefined | null;
export type State = { text: string } & Rect;
export type Target<T extends HTMLElement | Element | Window | Document> =
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>;

const initialState: State = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  width: 0,
  height: 0,
  text: '',
};

export default function useActiveSelection(target?: Target<Element | Document>): [State] {
  const [state, setState] = useState<State>(initialState);
  const currentStateRef = useRef<State>(state);

  const handleOnMouseDown = () => {
    if (!window.getSelection) {
      throw new Error('useActiveSelection window.getSelection not found');
    }
    if (currentStateRef.current) {
      setState({ ...initialState });
    }
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };

  const handleOnMouseUp = () => {
    if (!window.getSelection) {
      throw new Error('useActiveSelection window.getSelection not found');
    }
    const selection = window.getSelection();
    if (selection) {
      const selectionText = selection.toString();
      let selectionTextRect: Rect = initialState;
      if (selectionText && selection.rangeCount >= 1) {
        selectionTextRect = selection.getRangeAt(0).getBoundingClientRect();
      }
      setState((prev) => ({ ...prev, ...selectionTextRect, text: selectionText }));
    }
  };

  useLayoutEffect(() => {
    const dom = getElement(target);
    if (!dom) return;

    dom.addEventListener('mouseup', handleOnMouseUp);
    document.addEventListener('mousedown', handleOnMouseDown);

    return () => {
      dom.removeEventListener('mouseup', handleOnMouseUp);
      document.removeEventListener('mousedown', handleOnMouseDown);
    };
  }, [target]);

  return [state];
}

function getElement(target?: Target<Element | Document>) {
  if (!target) {
    return document;
  }

  if ('current' in target) {
    return target.current;
  }

  return target;
}
