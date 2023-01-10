import { renderHook, act } from '@testing-library/react-hooks';
import usePromise, { PromiseStatus } from '../index';

function useTemplate<T>(initialPromise: () => Promise<T>, initialData: T) {
  return renderHook(() => usePromise(initialPromise, initialData));
}

const mockResolveData = {
  data: {
    q: {
      w: {
        e: 1,
      },
    },
  },
};

const sleep = (delay = 3000) => {
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(delay);
    }, delay);
  });
};

describe('test usePromise', () => {
  it('when the promise success', async () => {
    const hook = useTemplate<any>(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(mockResolveData);
          }, 500);
        }),
      {},
    );

    expect(hook.result.current.state.data).toEqual({});

    hook.rerender();

    await sleep(500);

    expect(hook.result.current.state.data).toEqual(mockResolveData);
    expect(hook.result.current.state.status).toEqual(PromiseStatus.Done);
  });

  it('when the promise error', async () => {
    const hook = useTemplate<any>(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => {
            reject('error');
          }, 500);
        }),
      {},
    );

    expect(hook.result.current.state.data).toEqual({});

    hook.rerender();

    await sleep(500);

    expect(hook.result.current.state.data).toEqual({});
    expect(hook.result.current.state.error).toEqual('error');
    expect(hook.result.current.state.status).toEqual(PromiseStatus.Error);

    act(() => {
      hook.result.current.run();
    });

    expect(hook.result.current.state.data).toEqual({});
    expect(hook.result.current.state.error).toEqual(null);
    expect(hook.result.current.state.status).toEqual(PromiseStatus.Pending);

    await sleep(500);

    expect(hook.result.current.state.data).toEqual({});
    expect(hook.result.current.state.error).toEqual('error');
    expect(hook.result.current.state.status).toEqual(PromiseStatus.Error);
  });
});
