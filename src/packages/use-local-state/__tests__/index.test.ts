import { act, renderHook } from '@testing-library/react-hooks';
import useLocalState from '../index';

class OverviewStorage implements Storage {
  [file: string]: any;
  length = 0;
  map = new Map<string, string>();

  clear() {
    this.map.clear();
    this.length = 0
  }

  getItem(key: string) {
    return this.map.get(key) || null
  }

  removeItem(key: string) {
    if (this.map.delete(key)) {
      this.length -= 1
    }
  }

  setItem(key: string, value: string) {
    if (!this.map.has(key)) {
      this.length += 1
    }
    this.map.set(key, value)
  }

  key(index: number) {
    if (index >= this.map.size) {
      return null
    }
    return Array.from(this.map.keys())[index]
  }
}

(global as { localStorage: Storage }).localStorage = new OverviewStorage()

function useTemplateState<State>(props: { key: string; initialState?: State }) {
  return renderHook(({ key, initialState }) => {
    const [state, setState] = useLocalState<State>(key, initialState)
    return {
      state,
      setState
    }
  }, {
    initialProps: props
  })
}

describe('test useLocalState', () => {
  it('when initialState', () => {
    const hook = useTemplateState({ key: 'key1', initialState: { value: 'hello world' }})
    expect(hook.result.current.state).toEqual({ value: 'hello world' })

    hook.rerender({ key: 'key2', initialState: { value: 'hello world by key2' } })
    expect(hook.result.current.state).toEqual({ value: 'hello world by key2' })
  })

  it('when setState', () => {
    const hook = useTemplateState({ key: 'key1', initialState: 'hello world by key1' })
    act(() => {
      hook.result.current.setState('hello world by key1 updated')
    })
    expect(hook.result.current.state).toEqual('hello world by key1 updated')

    act(() => {
      hook.result.current.setState(undefined)
    })
    expect(hook.result.current.state).toBeUndefined()
  })
})
