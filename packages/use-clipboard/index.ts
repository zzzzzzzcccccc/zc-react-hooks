import { useState, useEffect } from 'react';
import copy from 'copy-to-clipboard';

export interface ClipboardOptions {
  debug?: boolean;
  message?: string;
  format?: string;
  onCopy?: (clipboardData: object) => void;
}

export type ClipboardState = { success: boolean; isCopied: boolean };
export type RunCopy = (text: string) => ClipboardState;
export type Reset = () => void;

export default function useClipboard(interval = 0, options?: ClipboardOptions): [RunCopy, ClipboardState, Reset] {
  const [state, setState] = useState<ClipboardState>({ success: false, isCopied: false });

  const runCopy = (text: string) => {
    const _state = { ...state };
    _state.success = copy(text, options);
    _state.isCopied = true;
    setState(_state);
    return _state;
  };

  const reset = () => {
    setState({ success: false, isCopied: false });
  };

  useEffect(() => {
    if (state.isCopied && interval > 0) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, isCopied: false }));
      }, interval);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.isCopied, interval]);

  return [runCopy, state, reset];
}
