import { renderHook } from '@testing-library/react-hooks';
import useLast from '../index';

function useTemplateState<T>(value: T) {
  return renderHook((state: T) => useLast<T>(state), { initialProps: value })
}

describe('test useLast', () => {
  it('when value is last', () => {
    const { result, rerender } = useTemplateState('hello world');

    rerender('hello world render1')
    expect(result.current).toEqual('hello world render1')

    rerender('hello world render2')
    expect(result.current).toEqual('hello world render2')

    rerender('hello world render3')
    expect(result.current).toEqual('hello world render3')
  })

  it('when value typeof object', () => {
    const { result, rerender } = useTemplateState<{ value?: string }>({ value: 'hello world' })

    expect(result.current).toEqual({ value: 'hello world' })

    rerender({})
    expect(result.current).toEqual({})
  })
})
