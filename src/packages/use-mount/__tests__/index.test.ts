import { renderHook } from '@testing-library/react-hooks';
import useMount from '../index';

describe('test useMount', () => {
  it('when fn call times', () => {
    const fn = jest.fn()
    const hook1 = renderHook(() => useMount(fn));

    expect(fn).toBeCalledTimes(1);

    hook1.rerender()
    expect(fn).toBeCalledTimes(1);

    hook1.unmount();
    expect(fn).toBeCalledTimes(1);

    const hook2 = renderHook(() => useMount(fn))

    hook2.unmount()
    expect(fn).toBeCalledTimes(2)
  })
})
