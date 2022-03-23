import { renderHook, act } from '@testing-library/react-hooks';
import useWhoUpdated from '../index';
import { useState } from 'react';

const mockComponentName = 'countComponentName';

function useTemplate() {
  return renderHook(() => {
    const [count, setCount] = useState(0);
    useWhoUpdated(mockComponentName, { count });
    return {
      setCount,
    };
  });
}

describe('test useWhoUpdated', () => {
  it('when state change show log', () => {
    console.log = jest.fn();
    const hook = useTemplate();

    act(() => {
      hook.result.current.setCount(50);
    });

    expect(console.log).toHaveBeenCalledWith(`useWhoUpdated - ${mockComponentName}`, {
      count: {
        before: 0,
        after: 50,
      },
    });
  });
});
