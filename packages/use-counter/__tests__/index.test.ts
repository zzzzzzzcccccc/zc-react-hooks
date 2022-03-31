import { renderHook, act } from '@testing-library/react-hooks';
import useCounter, { Options } from '../index';

function useTemplate(initialValue: number, options?: Options) {
  return renderHook(() => {
    const [num, methods] = useCounter(initialValue, options);
    return {
      num,
      methods,
    };
  });
}

describe('test useCounter', () => {
  it('when max and min both undefined', () => {
    const hook = useTemplate(5);
    expect(hook.result.current.num).toEqual(5);

    act(() => {
      hook.result.current.methods.setCurrent(999);
    });
    expect(hook.result.current.num).toEqual(999);

    act(() => {
      hook.result.current.methods.reset();
    });
    expect(hook.result.current.num).toEqual(5);

    act(() => {
      hook.result.current.methods.acc(1);
      hook.result.current.methods.acc(2);
      hook.result.current.methods.acc(3);
    });
    expect(hook.result.current.num).toEqual(11);

    act(() => {
      hook.result.current.methods.sub(4);
      hook.result.current.methods.sub(5);
      hook.result.current.methods.sub(6);
    });
    expect(hook.result.current.num).toEqual(-4);
  });

  it('when max undefined and min = -5', () => {
    const hook = useTemplate(20, { min: -5 });
    expect(hook.result.current.num).toEqual(20);

    act(() => {
      hook.result.current.methods.sub(30);
    });
    expect(hook.result.current.num).toEqual(-5);
  });

  it('when max = 20 and min undefined', () => {
    const hook = useTemplate(25, { max: 20 });
    expect(hook.result.current.num).toEqual(20);

    act(() => {
      hook.result.current.methods.sub(10000);
    });
    expect(hook.result.current.num).toEqual(-9980);
  });

  it('when min = 1 and max = 10', () => {
    const hook = useTemplate(0, { min: 1, max: 10 });
    expect(hook.result.current.num).toEqual(1);

    act(() => {
      hook.result.current.methods.acc(1);
      hook.result.current.methods.acc(1);
      hook.result.current.methods.acc(1);
    });
    expect(hook.result.current.num).toEqual(4);

    act(() => {
      hook.result.current.methods.setCurrent(5000);
    });
    expect(hook.result.current.num).toEqual(10);

    act(() => {
      hook.result.current.methods.reset();
    });
    expect(hook.result.current.num).toEqual(1);
  });
});
