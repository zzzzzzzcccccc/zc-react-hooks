import { renderHook, act } from '@testing-library/react-hooks';
import useList from '../index';

function useTemplate<T>(initialList: T[]) {
  return renderHook(() => {
    const [list, methods] = useList<T>(initialList);
    return {
      list,
      methods,
    };
  });
}

describe('test useTemplate', () => {
  it('when initialList string[]', () => {
    const hook = useTemplate<string>(['a', 'b', 'c']);
    expect(hook.result.current.list).toEqual(['a', 'b', 'c']);

    act(() => hook.result.current.methods.push('d'));
    expect(hook.result.current.list).toEqual(['a', 'b', 'c', 'd']);

    act(() => hook.result.current.methods.reset());
    expect(hook.result.current.list).toEqual([]);

    act(() => hook.result.current.methods.merge(['a', 'b', 'c'], 0));
    expect(hook.result.current.list).toEqual(['a', 'b', 'c']);

    act(() => hook.result.current.methods.merge(['e', 'f', 'g'], 1));
    expect(hook.result.current.list).toEqual(['a', 'e', 'f', 'g', 'b', 'c']);

    act(() => hook.result.current.methods.reset());
    expect(hook.result.current.list).toEqual([]);

    act(() => hook.result.current.methods.push('world'));
    expect(hook.result.current.list).toEqual(['world']);

    act(() => hook.result.current.methods.unshift('hello'));
    expect(hook.result.current.list).toEqual(['hello', 'world']);

    act(() => hook.result.current.methods.replace('china', 1));
    expect(hook.result.current.list).toEqual(['hello', 'china']);

    act(() => hook.result.current.methods.move(0, 1));
    expect(hook.result.current.list).toEqual(['china', 'hello']);
  });
});
