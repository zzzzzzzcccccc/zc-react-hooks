import { useState } from 'react';
import { escapeRegExp, entries, isArray } from 'lodash';
import { sortDataList } from '../utils';
import { SortType } from '../utils/sortDataList';

export type QueryType = 'and' | 'or';
export type SortRecord<T> = {
  key: keyof T;
  type: SortType;
};
export type TreeOptions<T> = {
  idKey: keyof T;
  pidKey: keyof T;
  rootPidVal?: string | number | null;
  childKey?: string;
  levelKey?: string;
  startLevelVal?: number;
  targetListVal?: 'list' | 'filterList';
};
export type Methods<T> = {
  reset: () => void;
  push: (payload: T | T[]) => T[];
  unshift: (payload: T | T[]) => T[];
  remove: (index: number) => T[];
  move: (oldIndex: number, newIndex: number) => T[];
  replace: (payload: T, index: number) => T[];
  merge: (payload: T[], startIndex: number) => T[];
  shift: () => T[];
  pop: () => T[];
  query: (params: Partial<Record<keyof T, any>>, type?: QueryType) => T[];
  sort: (sortConfig: SortType | SortRecord<T>[]) => T[];
  toTree: (options: TreeOptions<T>) => T[];
};

export default function useList<T>(initialList: T[] = []): [T[], Methods<T>, T[]] {
  const [list, setList] = useState<T[]>(initialList);
  const [filterList, setFilterList] = useState<T[]>([]);

  const reset: Methods<T>['reset'] = () => {
    setList([]);
  };

  const push: Methods<T>['push'] = (payload: T | T[]) => {
    let temp = [...list];
    setList((prev) => {
      temp = isArray(payload) ? [...prev, ...payload] : [...prev, payload];
      return temp;
    });
    return temp;
  };

  const unshift: Methods<T>['unshift'] = (payload: T | T[]) => {
    let temp = [...list];
    setList((prev) => {
      temp = isArray(payload) ? [...payload, ...prev] : [payload, ...prev];
      return temp;
    });
    return temp;
  };

  const remove: Methods<T>['remove'] = (index: number) => {
    let temp = [...list];
    setList((prev) => {
      temp = prev.filter((v, i) => i !== index);
      return temp;
    });
    return temp;
  };

  const move: Methods<T>['move'] = (oldIndex: number, newIndex: number) => {
    let tempList = [...list];
    setList((prev) => {
      let temp = prev[oldIndex],
        tempList = [...list];

      tempList[oldIndex] = tempList[newIndex];
      tempList[newIndex] = temp;

      return tempList;
    });
    return tempList;
  };

  const replace: Methods<T>['replace'] = (payload: T, index: number) => {
    if (index < 0) {
      throw new Error('useList replace index > 0');
    }

    let temp = [...list];
    setList((prev) => {
      temp = [...prev];
      temp[index] = payload;

      return temp;
    });
    return temp;
  };

  const merge: Methods<T>['merge'] = (payload: T[], startIndex: number) => {
    if (startIndex < 0) {
      throw new Error('useList merge startIndex > 0');
    }

    let temp = [...list];
    setList((prev) => {
      temp = [...prev];
      temp.splice(startIndex, 0, ...payload);
      return temp;
    });
    return temp;
  };

  const shift: Methods<T>['shift'] = () => {
    let temp = [...list];
    setList((prev) => {
      temp = [...prev.filter((v, i) => i !== 0)];
      return temp;
    });
    return temp;
  };

  const pop: Methods<T>['pop'] = () => {
    let temp = [...list];
    setList((prev) => {
      temp = [...prev.filter((v, i) => i !== list.length - 1)];
      return temp;
    });
    return temp;
  };

  const query: Methods<T>['query'] = (params: Partial<Record<keyof T, any>>, queryType: QueryType = 'or') => {
    let tempFilterList: T[];
    if (typeof params !== 'object') {
      tempFilterList = list.filter((v) => new RegExp(escapeRegExp(params + ''), 'i').test(v + ''));
    } else {
      if (Object.keys(params).length <= 0) {
        tempFilterList = [];
      } else {
        tempFilterList = list.filter((record) => {
          return entries(params as unknown as object)[queryType === 'or' ? 'some' : 'every'](([key, value]) => {
            const recordValue = record[key as keyof T];
            if (typeof recordValue === 'boolean') {
              return recordValue === value;
            }
            if (value instanceof RegExp) {
              return value.test(recordValue + '');
            }
            return new RegExp(escapeRegExp(value), 'i').test(recordValue + '');
          });
        });
      }
    }
    setFilterList(tempFilterList);
    return tempFilterList;
  };

  const sort: Methods<T>['sort'] = (sortConfig: SortType | SortRecord<T>[]) => {
    let tempSortList: T[] = [...list];
    if (sortConfig === 'asc' || sortConfig === 'desc') {
      tempSortList = sortDataList(list, sortConfig, undefined);
    } else {
      for (let i = 0; i < sortConfig.length; i++) {
        const { key, type } = sortConfig[i];
        tempSortList = sortDataList(tempSortList, type, key);
      }
    }
    setList(tempSortList);
    return tempSortList;
  };

  const toTree: Methods<T>['toTree'] = (options: TreeOptions<T>) => {
    const {
      idKey,
      pidKey,
      rootPidVal = 0,
      childKey = 'children',
      levelKey = 'level',
      startLevelVal = 1,
      targetListVal = 'list',
    } = options;
    if (idKey === pidKey) {
      throw new Error('useList toTree idKey !== pidKey');
    }

    const listToTree = (arr: T[], pidVal = rootPidVal, levelVal = startLevelVal) => {
      const out: T[] = [];

      for (let i = 0; i < arr.length; i++) {
        // @ts-ignore
        if (list[i][pidKey] === pidVal) {
          // @ts-ignore
          arr[i][levelKey] = levelVal;
          // @ts-ignore
          const childList = listToTree(arr, arr[i][idKey], levelVal + 1);
          // @ts-ignore
          if (childList.length) arr[i][childKey] = childList;

          out.push(arr[i]);
        }
      }

      return out;
    };

    return listToTree(targetListVal === 'list' ? list : filterList);
  };

  return [
    list,
    {
      reset,
      push,
      unshift,
      remove,
      move,
      replace,
      merge,
      shift,
      pop,
      query,
      sort,
      toTree,
    },
    filterList,
  ];
}
