import { useEffect } from 'react';
import { getElement, keyboardMapper } from '../utils';
import { Target } from '../utils/getElement';

export interface Options {
  listenEvent?: 'keydown' | 'keyup';
  handler?: (e: KeyboardEvent) => void;
}
export type KeyCodes = (string | number)[];

const defaultKeyboard: Record<string, string> = {
  ctrl: 'ctrlKey',
  shift: 'shiftKey',
  alt: 'altKey',
  meta: 'metaKey',
};

export default function useKeyboard(keyCodes: KeyCodes, options?: Options, target?: Target<Element | Document>) {
  if (!keyCodes || keyCodes.length <= 0) {
    throw new Error('useKeyboard keyCodes must be array');
  }
  const currentEvent = options?.listenEvent || 'keydown';
  let hitCodeLen = 0;

  const validKeyCores = (e: KeyboardEvent) => {
    if (!e.key) {
      return false;
    }

    for (let i = 0; i < keyCodes.length; i++) {
      const keyCode = keyCodes[i];
      if (typeof keyCode === 'number' && keyCode === e.keyCode) {
        hitCodeLen++;
      } else {
        const hasDefaultKeyboard = defaultKeyboard[keyCode];
        // @ts-ignore
        if (hasDefaultKeyboard && e[hasDefaultKeyboard]) {
          hitCodeLen++;
        } else {
          if (keyboardMapper[keyCode] === e.keyCode) {
            hitCodeLen++;
          }
        }
      }
    }

    return hitCodeLen === keyCodes.length;
  };

  const handleKeyboard = (e: KeyboardEvent) => {
    if (!validKeyCores(e)) {
      return;
    }
    options?.handler?.(e);
  };

  useEffect(() => {
    const dom = getElement(target);
    if (!dom) {
      return;
    }

    // @ts-ignore
    dom.addEventListener?.(currentEvent, handleKeyboard);

    return () => {
      // @ts-ignore
      dom.removeEventListener?.(currentEvent, handleKeyboard);
    };
  }, [target, keyCodes]);
}
