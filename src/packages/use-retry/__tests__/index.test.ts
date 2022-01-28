import { act, renderHook } from '@testing-library/react-hooks';
import useRetry, { Task, Options } from '../index';

function useTemplateRetry<T>(task: Task<T>, options: Options<T>){
  return renderHook(() => {
    const [run, loading, errorList] = useRetry<T>(task, options);
    return {
      run,
      loading,
      errorList,
    }
  })
}

const mockResolveFn = () => new Promise<string>(resolve => resolve('done'));
const mockRejectFn = () => new Promise<string>((resolve, reject) => reject('failed'));

describe('test useRetry', () => {
  it('when resolve task', () => {
    const errorCallback = jest.fn()
    const hook = useTemplateRetry<string>(mockResolveFn, { count: 3, onResolved: errorCallback });
    act(() => {
      hook.result.current.run()
    });
    expect(hook.result.current.loading).toEqual(true);
    expect(hook.result.current.errorList.length).toEqual(0);
    hook.waitFor(() => {
      expect(errorCallback).toHaveBeenCalledTimes(0);
      expect(mockRejectFn).toHaveBeenCalledTimes(1);
      expect(hook.result.current.loading).toEqual(false);
      expect(hook.result.current.errorList.length).toEqual(0);
    })
  })

  it('when reject task', () => {
    const errorCallback = jest.fn();
    const hook = useTemplateRetry<string>(mockRejectFn, { count: 5, onRejected: errorCallback });
    act(() => {
      hook.result.current.run().catch(console.log)
    })
    expect(hook.result.current.loading).toEqual(true);
    expect(hook.result.current.errorList.length).toEqual(0);
    hook.waitFor(() => {
      expect(errorCallback).toHaveBeenCalledTimes(5);
      expect(mockRejectFn).toHaveBeenCalledTimes(5);
      expect(hook.result.current.loading).toEqual(false);
      expect(hook.result.current.errorList).toEqual(['failed', 'failed', 'failed', 'failed', 'failed']);
    })
  })
});
