import { renderHook, act } from '@testing-library/react-hooks';
import useActiveSelection from '../index';

const initSelection = ({ text = 'mock-test', top = 0, left = 0, width = 0, height = 0 }) => {
  global.getSelection = () => ({
    // @ts-ignore
    toString: () => text,
    // @ts-ignore
    rangeCount: () => text.length,
    removeAllRanges: () => jest.fn(),
    // @ts-ignore
    getRangeAt: (index: number) => ({
      top,
      bottom: top + height,
      left,
      right: left + width,
      width,
      height,
    }),
  });
};

const dispatchMouseDown = (x: number, y: number) => {
  act(() => {
    document.dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
      }),
    );
  });
};

const dispatchMouseUp = (x: number, y: number) => {
  act(() => {
    document.dispatchEvent(
      new MouseEvent('mouseup', {
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
      }),
    );
  });
};

describe('test useActiveSelection', () => {
  initSelection({ text: 'hello world', top: 20, left: 20, width: 100, height: 20 });

  it('should be useActiveSelection', () => {
    const hook = renderHook(() => {
      const [state] = useActiveSelection(document);
      return state;
    });

    expect(hook.result.current).toEqual({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0,
      text: '',
    });

    dispatchMouseDown(0, 0);
    dispatchMouseUp(100, 20);

    expect(hook.result.current.text).toEqual('hello world');
  });
});
