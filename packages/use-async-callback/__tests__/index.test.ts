import { useState } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useAsyncCallback from '../index';

const sleep = (timer: number) => new Promise<number>((resolve) => setTimeout(() => resolve(timer), timer));

describe('test useAsyncCallback', () => {
  it('when run test', async () => {
    const hook = renderHook(() => {
      const [count, setCount] = useState(0);
      const asyncRun = useAsyncCallback(async (count: number) => {
        await sleep(100);
        setCount(count);
      });
      return {
        count,
        asyncRun,
      };
    });

    await hook.result.current.asyncRun(10);
    expect(hook.result.current.count).toEqual(10);
  });
});
