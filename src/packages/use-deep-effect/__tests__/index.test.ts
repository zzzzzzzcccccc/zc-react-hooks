import { useState } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useDeepEffect from '../index';

describe('test useDeepEffect', () => {
  it('when deps diff',  () => {
    const hook = renderHook(() => {
      const [num, setNum] = useState(0)
      const [record, setRecord] = useState<Record<string, any>>({})

      useDeepEffect(() => {
        setNum(1)
      }, [num, record])

      return {
        num,
        setNum,
        record,
        setRecord,
      }
    })

    expect(hook.result.current.num).toEqual(1)

    act(() => {
      hook.result.current.setRecord({})
    })

    expect(hook.result.current.num).toEqual(1)
  })
})
