import { renderHook } from '@testing-library/react-hooks';
import useActiveSelection from '../index';

describe('test useActiveSelection', () => {
  it('should be useActiveSelection initialState', () => {
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
      x: 0,
      y: 0,
      text: '',
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
    });
  });
});
