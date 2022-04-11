import { renderHook, act } from '@testing-library/react-hooks';
import useObservable, { BehaviorSubjectObservable } from '../index';
import { BehaviorSubject } from 'rxjs';

function useTemplate<T>(observable$: BehaviorSubjectObservable<T>, initialValue: T | undefined = undefined) {
  return renderHook(() => {
    const [value] = useObservable(observable$, initialValue);
    return {
      value,
    };
  });
}

describe('test useObservable', () => {
  it('when use rxjs BehaviorSubject', () => {
    const counter$ = new BehaviorSubject(0);
    const hook = useTemplate(counter$);

    hook.rerender();

    expect(hook.result.current.value).toEqual(0);

    act(() => {
      counter$.next((hook.result.current.value as number) + 1);
    });
    expect(hook.result.current.value).toEqual(1);
  });
});
