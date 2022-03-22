import { act, renderHook } from '@testing-library/react-hooks';
import useLocalState from '../index';

function useTemplateState<State>(props: { key: string; initialState?: State }) {
  return renderHook(
    ({ key, initialState }) => {
      const [state, setState] = useLocalState<State>(key, initialState);
      return {
        state,
        setState,
      };
    },
    {
      initialProps: props,
    },
  );
}

describe('test useLocalState', () => {
  it('when initialState', () => {
    const hook = useTemplateState({ key: 'key1', initialState: { value: 'hello world' } });
    expect(hook.result.current.state).toEqual({ value: 'hello world' });

    hook.rerender({ key: 'key2', initialState: { value: 'hello world by key2' } });
    expect(hook.result.current.state).toEqual({ value: 'hello world by key2' });
  });

  it('when setState', () => {
    const hook = useTemplateState({ key: 'key1', initialState: 'hello world by key1' });
    act(() => {
      hook.result.current.setState('hello world by key1 updated');
    });
    expect(hook.result.current.state).toEqual('hello world by key1 updated');

    act(() => {
      hook.result.current.setState(undefined);
    });
    expect(hook.result.current.state).toBeUndefined();
  });
});
