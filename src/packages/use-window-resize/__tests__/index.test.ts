import { renderHook, act } from '@testing-library/react-hooks';
import useWindowResize, { CallbackFunction, Options } from '../index';

function useTemplateHook(fn?: CallbackFunction, options?: Options) {
  return renderHook(() => {
    const [size] = useWindowResize(fn, options);
    return size;
  });
}

describe('test useWindowResize', () => {
  it('window size initial from window', () => {
    const hook = useTemplateHook();

    hook.rerender();

    act(() => {
      window.innerWidth = 500;
      window.innerHeight = 500;
      window.dispatchEvent(new Event('resize'));
    });

    expect(hook.result.current.width).toEqual(500);
    expect(hook.result.current.height).toEqual(500);
  });

  it('when listenerResize callback', () => {
    const fn = jest.fn();
    const hook = useTemplateHook(fn);

    hook.rerender();

    act(() => {
      window.innerWidth = 300;
      window.innerHeight = 600;
      window.dispatchEvent(new Event('resize'));
    });

    expect(fn).toBeCalledTimes(1);
    expect(hook.result.current.width).toEqual(300);
    expect(hook.result.current.height).toEqual(600);
  });
});
