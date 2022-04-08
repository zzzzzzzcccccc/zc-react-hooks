import { useState, useRef, useEffect } from 'react';
import { getElement } from '../utils';
import { Target } from '../utils/getElement';

export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

export type State = { text: string } & Rect;

const initialState: State = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  width: 0,
  height: 0,
  text: '',
  x: 0,
  y: 0,
};

function getSelectionRectWithText(selection: Selection | null) {
  if (!selection) {
    return initialState;
  }
  const selectionText = selection.toString();
  if (selectionText && selection.rangeCount >= 1) {
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    return {
      text: selectionText,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      x: rect.x,
      y: rect.y,
    };
  } else {
    return initialState;
  }
}

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
    setState((prev) => ({ ...prev, ...getSelectionRectWithText(selection) }));
  };

  useEffect(() => {
    const dom = getElement(target);
    if (!dom) return;

    dom.addEventListener('mouseup', handleOnMouseUp);
    dom.addEventListener('mousedown', handleOnMouseDown);

    return () => {
      dom.removeEventListener('mouseup', handleOnMouseUp);
      dom.removeEventListener('mousedown', handleOnMouseDown);
    };
  }, [target]);

  return [state];
}
