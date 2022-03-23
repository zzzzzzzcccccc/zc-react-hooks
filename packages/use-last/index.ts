import { useRef } from 'react';

export default function useLast<T>(payload: T) {
  const ref = useRef(payload);

  ref.current = payload;

  return ref.current;
}
