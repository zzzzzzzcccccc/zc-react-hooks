import { renderHook, act } from '@testing-library/react-hooks';
import useWindowVisibility, { Callback } from '../index';

function useTemplate(fn: Callback) {
  return renderHook(() => useWindowVisibility(fn));
}

describe('test useWindowVisibility', () => {
  it('when mounted callback call', () => {
    const fn = jest.fn();
    const hook = useTemplate(fn);

    expect(fn).toBeCalledTimes(0);

    hook.rerender();

    expect(fn).toBeCalledTimes(0);

    act(() => {
      window.dispatchEvent(new Event('visibilitychange'));
    });

    expect(fn).toBeCalledTimes(1);

    act(() => {
      window.dispatchEvent(new Event('visibilitychange'));
      window.dispatchEvent(new Event('visibilitychange'));
    });

    expect(fn).toBeCalledTimes(3);
  });

  it('when unmount call unmount', () => {
    const fn = jest.fn();
    const hook = useTemplate(fn);

    hook.rerender();

    act(() => {
      window.dispatchEvent(new Event('visibilitychange'));
      window.dispatchEvent(new Event('visibilitychange'));
    });

    expect(fn).toBeCalledTimes(2);

    hook.unmount();

    act(() => {
      window.dispatchEvent(new Event('visibilitychange'));
      window.dispatchEvent(new Event('visibilitychange'));
    });

    expect(fn).toBeCalledTimes(2);
  });
});
