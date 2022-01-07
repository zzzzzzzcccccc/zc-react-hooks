import { useState } from 'react';

type Patch = {
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};

export default function useBooleanState(initialState: boolean): [boolean, Patch] {
  const [bool, setBool] = useState(initialState);

  return [
    bool,
    {
      toggle: () => setBool(!bool),
      setTrue: () => setBool(true),
      setFalse: () => setBool(false),
    },
  ];
}
