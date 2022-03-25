import { useState } from 'react';

export type Methods<T> = {
  reset: () => void;
  push: (payload: T) => void;
  unshift: (payload: T) => void;
  remove: (index: number) => void;
  move: (oldIndex: number, newIndex: number) => void;
  replace: (payload: T, index: number) => void;
  merge: (payload: T[], startIndex: number) => void;
  shift: () => void;
  pop: () => void;
};

export default function useList<T>(initialList: T[] = []): [T[], Methods<T>] {
  const [list, setList] = useState<T[]>(initialList);

  const reset: Methods<T>['reset'] = () => {
    setList([]);
  };

  const push: Methods<T>['push'] = (payload: T) => {
    setList([...list, payload]);
  };

  const unshift: Methods<T>['unshift'] = (payload: T) => {
    setList([payload, ...list]);
  };

  const remove: Methods<T>['remove'] = (index: number) => {
    setList(list.filter((v, i) => i !== index));
  };

  const move: Methods<T>['move'] = (oldIndex: number, newIndex: number) => {
    let temp = list[oldIndex],
      tempList = list;

    tempList[oldIndex] = tempList[newIndex];
    tempList[newIndex] = temp;

    setList(tempList);
  };

  const replace: Methods<T>['replace'] = (payload: T, index: number) => {
    if (index < 0) {
      throw new Error('useList replace index > 0');
    }
    const tempList = list;
    tempList[index] = payload;

    setList(tempList);
  };

  const merge: Methods<T>['merge'] = (payload: T[], startIndex: number) => {
    if (startIndex < 0) {
      throw new Error('useList merge startIndex > 0');
    }
    const tempList = list;

    tempList.splice(startIndex, 0, ...payload);

    setList(tempList);
  };

  const shift: Methods<T>['shift'] = () => {
    setList(list.filter((v, i) => i !== 0));
  };

  const pop: Methods<T>['pop'] = () => {
    setList(list.filter((v, i) => i !== list.length - 1));
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
    },
  ];
}
