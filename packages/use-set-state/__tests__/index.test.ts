import { act, renderHook } from '@testing-library/react-hooks';
import useSetState from '../index';

function useTemplateState<T extends object>(initialState: T) {
  return renderHook(() => {
    const [state, setState] = useSetState<T>(initialState);
    return {
      state,
      setState,
    };
  });
}

describe('test useSetState', () => {
  it('when record initialState', () => {
    const hook = useTemplateState({ value: 'hello world' });
    expect(hook.result.current.state).toEqual({ value: 'hello world' });
  });

  it('when record add key', () => {
    const hook = useTemplateState<{ a: number; b: number; d?: number; e?: number }>({ a: 1, b: 2 });
    act(() => {
      hook.result.current.setState({ d: 3, e: 4 });
    });
    expect(hook.result.current.state).toEqual({ a: 1, b: 2, d: 3, e: 4 });
  });

  it('when record update value', () => {
    const hook = useTemplateState({ value: 'hello world' });
    act(() => {
      hook.result.current.setState({ value: 'hello world hook' });
    });
    expect(hook.result.current.state).toEqual({ value: 'hello world hook' });
  });

  it('when record remove key', () => {
    const hook = useTemplateState<{ a: number; b?: number }>({ a: 1, b: 2 });
    act(() => {
      hook.result.current.setState({ b: undefined });
    });
    expect(hook.result.current.state).toEqual({ a: 1 });
  });
});
