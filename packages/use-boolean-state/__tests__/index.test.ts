import { act, renderHook } from '@testing-library/react-hooks';
import useBooleanState from '../index';

function useTemplateState(initialState: boolean) {
  return renderHook(() => {
    const [state, patch] = useBooleanState(initialState);
    return {
      state,
      patch,
    };
  });
}

describe('test useBooleanState', () => {
  it('when initialState boolean', () => {
    const hook = useTemplateState(false);
    expect(hook.result.current.state).toEqual(false);
  });

  it('when trigger toggle', () => {
    const hook = useTemplateState(false);
    act(() => hook.result.current.patch.toggle());
    expect(hook.result.current.state).toEqual(true);
  });

  it('when trigger setFalse', () => {
    const hook = useTemplateState(false);
    act(() => hook.result.current.patch.setFalse());
    expect(hook.result.current.state).toEqual(false);
  });

  it('when trigger setTrue', () => {
    const hook = useTemplateState(false);
    act(() => hook.result.current.patch.setTrue());
    expect(hook.result.current.state).toEqual(true);
  });
});
