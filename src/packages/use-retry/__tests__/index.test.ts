import { act, renderHook } from '@testing-library/react-hooks';
import useRetry, { Task, Options } from '../index';

function useTemplateRetry<T>(task: Task<T>, options: Options<T>) {
  return renderHook(() => {
    const [run, loading, errorList] = useRetry<T>(task, options);
    return {
      run,
      loading,
      errorList,
    };
  });
}

const mockResolveFn = () => new Promise<string>((resolve) => resolve('done'));
const mockRejectFn = () => new Promise<string>((resolve, reject) => reject('failed'));

describe('test useRetry', () => {
  it('when resolve task', async () => {
    const resolvedCallback = jest.fn();
    const rejectedCallback = jest.fn();
    const hook = useTemplateRetry<string>(mockResolveFn, {
      count: 3,
      onResolved: resolvedCallback,
      onRejected: rejectedCallback,
    });

    expect(resolvedCallback).toHaveBeenCalledTimes(0);
    expect(rejectedCallback).toHaveBeenCalledTimes(0);

    await act(async () => {
      const result = await hook.result.current.run();
      expect(result).toEqual('done');

      expect(resolvedCallback).toHaveBeenCalledTimes(1);
      expect(rejectedCallback).toHaveBeenCalledTimes(0);
    });
  });

  it('when reject task', async () => {
    const resolvedCallback = jest.fn();
    const rejectedCallback = jest.fn();
    const hook = useTemplateRetry<string>(mockRejectFn, {
      count: 5,
      onResolved: resolvedCallback,
      onRejected: rejectedCallback,
    });

    expect(resolvedCallback).toHaveBeenCalledTimes(0);
    expect(rejectedCallback).toHaveBeenCalledTimes(0);

    await act(async () => {
      try {
        await hook.result.current.run();
      } catch (e) {
        expect(e).toEqual('failed');
        expect(resolvedCallback).toHaveBeenCalledTimes(0);
        expect(rejectedCallback).toHaveBeenCalledTimes(5);
      }
    });
  });
});
