import { useState, useRef, useEffect } from 'react';
import { getElement } from '../utils';
import { Target } from '../utils/getElement';

export interface MouseRect {
  screenX: number;
  screenY: number;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
}

export interface Rect extends Partial<MouseRect> {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

export type State = { text: string; html: string } & Rect;

const initialState: State = {
  text: '',
  html: '',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
  pageX: 0,
  pageY: 0,
};

function getSelectionWithInnerHTML(selection: Selection | null) {
  if (
    typeof (document as any)?.selection !== 'undefined' &&
    typeof (document as any)?.selection?.createRange !== 'undefined'
  ) {
    return ((document as any).selection.createRange().htmlText || '') as string;
  } else {
    if (!selection || selection.rangeCount <= 0) {
      return ''
    }
    const range = selection.getRangeAt(0);
    const clonedSelection = range.cloneContents();
    const div = document.createElement('div');

    div.appendChild(clonedSelection);

    return div.innerHTML;
  }
}

function getSelectionRectWithText(selection: Selection | null) {
  if (!selection) {
    return initialState;
  }
  const selectionText = selection.toString();
  if (selectionText && selection.rangeCount > 0) {
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

  const handleOnMouseUp = (e: MouseEvent) => {
    if (!window.getSelection) {
      throw new Error('useActiveSelection window.getSelection not found');
    }
    const selection = window.getSelection();
    const { screenX, screenY, clientX, clientY, pageX, pageY } = e;
    setState((prev) => ({
      ...prev,
      ...getSelectionRectWithText(selection),
      html: getSelectionWithInnerHTML(selection),
      screenX,
      screenY,
      clientX,
      clientY,
      pageX,
      pageY,
    }));
  };

  useEffect(() => {
    const dom = getElement(target);
    if (!dom) return;

    // @ts-ignore
    dom.addEventListener('mouseup', handleOnMouseUp);
    dom.addEventListener('mousedown', handleOnMouseDown);

    return () => {
      // @ts-ignore
      dom.removeEventListener('mouseup', handleOnMouseUp);
      dom.removeEventListener('mousedown', handleOnMouseDown);
    };
  }, [target]);

  return [state];
}
