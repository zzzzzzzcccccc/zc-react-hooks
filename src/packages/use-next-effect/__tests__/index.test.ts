import { renderHook } from '@testing-library/react-hooks';
import useNextEffect from '../index';

describe('test useNextEffect', () => {
  it('when trigger effect', () => {
    let mountedState = 1;
    const hook = renderHook(() => {
      useNextEffect(() => {
        mountedState = 2;
      }, []);
    });
    expect(mountedState).toEqual(1);
    hook.rerender();
    expect(mountedState).toEqual(1);
  });
});
