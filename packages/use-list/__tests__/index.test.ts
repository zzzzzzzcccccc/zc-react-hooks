import { renderHook, act } from '@testing-library/react-hooks';
import useList from '../index';

function useTemplate<T>(initialList: T[]) {
  return renderHook(() => {
    const [list, methods, queryList] = useList<T>(initialList);
    return {
      list,
      methods,
      queryList,
    };
  });
}

describe('test useTemplate', () => {
  it('when initialList string[]', () => {
    const hook = useTemplate<string>(['a', 'b', 'c']);
    expect(hook.result.current.list).toEqual(['a', 'b', 'c']);

    act(() => {
      hook.result.current.methods.push('d');
    });
    expect(hook.result.current.list).toEqual(['a', 'b', 'c', 'd']);

    act(() => hook.result.current.methods.reset());
    expect(hook.result.current.list).toEqual([]);

    act(() => {
      hook.result.current.methods.merge(['a', 'b', 'c'], 0);
    });
    expect(hook.result.current.list).toEqual(['a', 'b', 'c']);

    act(() => {
      hook.result.current.methods.merge(['e', 'f', 'g'], 1);
    });
    expect(hook.result.current.list).toEqual(['a', 'e', 'f', 'g', 'b', 'c']);

    act(() => hook.result.current.methods.reset());
    expect(hook.result.current.list).toEqual([]);

    act(() => {
      hook.result.current.methods.push('world');
    });
    expect(hook.result.current.list).toEqual(['world']);

    act(() => {
      hook.result.current.methods.unshift('hello');
    });
    expect(hook.result.current.list).toEqual(['hello', 'world']);

    act(() => {
      hook.result.current.methods.replace('china', 1);
    });
    expect(hook.result.current.list).toEqual(['hello', 'china']);

    act(() => {
      hook.result.current.methods.move(0, 1);
    });
    expect(hook.result.current.list).toEqual(['china', 'hello']);
  });

  it('when query and sort list', () => {
    const hook = useTemplate<string>(['zhangsan', 'lisi', 'wanwu']);

    act(() => {
      hook.result.current.methods.query('wa');
    });
    expect(hook.result.current.queryList).toEqual(['wanwu']);

    act(() => {
      hook.result.current.methods.query('a');
    });
    expect(hook.result.current.queryList).toEqual(['zhangsan', 'wanwu']);

    act(() => {
      hook.result.current.methods.sort('desc');
    });
    expect(hook.result.current.list).toEqual(['zhangsan', 'wanwu', 'lisi']);
  });

  it('when query and sort record list', () => {
    const hook = useTemplate<{ id: string; number: number; bool: boolean; name: string; type: 'string' }>([]);

    const defaultList: any = [
      { id: '1', number: 21, bool: false, name: '周星驰', type: '01-1' },
      { id: '2', number: 22, bool: false, name: '刘德华', type: '01-1' },
      { id: '3', number: 33, bool: false, name: '邓丽君', type: '01-2' },
      { id: '4', number: 44, bool: false, name: '吴君如', type: '01-2' },
    ];

    act(() => {
      hook.result.current.methods.push(defaultList);
    });
    expect(hook.result.current.list).toEqual(defaultList);

    act(() => {
      hook.result.current.methods.query({ id: '4' });
    });
    expect(hook.result.current.queryList).toEqual([defaultList[3]]);

    act(() => {
      hook.result.current.methods.query({});
    });
    expect(hook.result.current.queryList).toEqual([]);

    act(() => {
      hook.result.current.methods.sort([{ type: 'desc', key: 'id' }]);
    });
    expect(hook.result.current.list).toEqual([defaultList[3], defaultList[2], defaultList[1], defaultList[0]]);

    act(() => {
      hook.result.current.methods.sort([{ type: 'asc', key: 'number' }]);
    });
    expect(hook.result.current.list).toEqual(defaultList);

    act(() => {
      hook.result.current.methods.sort([{ type: 'desc', key: 'type' }]);
    });
    expect(hook.result.current.list).toEqual([defaultList[2], defaultList[3], defaultList[0], defaultList[1]]);
  });

  it('when list to tree', () => {
    const defaultList = [
      { id: 1, name: 'A', pid: 0 },
      { id: 2, name: 'A-1', pid: 1 },
      { id: 3, name: 'A-2', pid: 1 },
      { id: 4, name: 'A-3', pid: 1 },
      { id: 5, name: 'A-2-1', pid: 2 },
      { id: 6, name: 'A-2-2', pid: 2 },
      { id: 7, name: 'A-2-1-1', pid: 5 },
      { id: 8, name: 'B', pid: 0 },
      { id: 9, name: 'B-1', pid: 8 },
      { id: 10, name: 'B-1-1', pid: 9 },
      { id: 11, name: 'C', pid: 0 },
      { id: 12, name: 'C-1', pid: 11 },
    ];
    const hook = useTemplate<any>(defaultList);
    expect(hook.result.current.list).toEqual(defaultList);

    let tree;
    act(() => {
      tree = hook.result.current.methods.toTree({ idKey: 'id', pidKey: 'pid', levelKey: 'level' });
    });
    expect(tree).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "children": Array [
                    Object {
                      "id": 7,
                      "level": 4,
                      "name": "A-2-1-1",
                      "pid": 5,
                    },
                  ],
                  "id": 5,
                  "level": 3,
                  "name": "A-2-1",
                  "pid": 2,
                },
                Object {
                  "id": 6,
                  "level": 3,
                  "name": "A-2-2",
                  "pid": 2,
                },
              ],
              "id": 2,
              "level": 2,
              "name": "A-1",
              "pid": 1,
            },
            Object {
              "id": 3,
              "level": 2,
              "name": "A-2",
              "pid": 1,
            },
            Object {
              "id": 4,
              "level": 2,
              "name": "A-3",
              "pid": 1,
            },
          ],
          "id": 1,
          "level": 1,
          "name": "A",
          "pid": 0,
        },
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "id": 10,
                  "level": 3,
                  "name": "B-1-1",
                  "pid": 9,
                },
              ],
              "id": 9,
              "level": 2,
              "name": "B-1",
              "pid": 8,
            },
          ],
          "id": 8,
          "level": 1,
          "name": "B",
          "pid": 0,
        },
        Object {
          "children": Array [
            Object {
              "id": 12,
              "level": 2,
              "name": "C-1",
              "pid": 11,
            },
          ],
          "id": 11,
          "level": 1,
          "name": "C",
          "pid": 0,
        },
      ]
    `);
  });
});
