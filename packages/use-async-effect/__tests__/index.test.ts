import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react';
import useAsyncEffect from '../index';

const sleep = (timer: number) => new Promise<number>((resolve) => setTimeout(() => resolve(timer), timer));

describe('test useAsyncEffect', () => {
  it('when asyncEffectCallback is promise', async () => {
    const hook = renderHook(() => {
      const [count, setCount] = useState(0);

      useAsyncEffect(async () => {
        await sleep(200);
        setCount(5);
      }, []);

      return {
        count,
      };
    });

    hook.rerender();
    expect(hook.result.current.count).toEqual(0);

    await act(async () => {
      await sleep(200);
    });
    expect(hook.result.current.count).toEqual(5);
  });

  it('when asyncEffectCallback is yield', async () => {
    const hook = renderHook(() => {
      const [count, setCount] = useState(0);

      useAsyncEffect(async function* () {
        await sleep(100);
        yield;
        setCount(1);

        await sleep(100);
        yield;
        setCount(10);
      }, []);

      return {
        count,
      };
    });

    hook.rerender();
    expect(hook.result.current.count).toEqual(0);

    await act(async () => {
      await sleep(100);
    });
    expect(hook.result.current.count).toEqual(1);

    await act(async () => {
      await sleep(100);
    });
    expect(hook.result.current.count).toEqual(10);
  });
});
