import { useEffect } from 'react';

export type Callback = (hidden: boolean) => void;

export default function useWindowVisibility(fn: Callback) {
  const listen = (e: Event) => {
    const target = e.target as Document;
    fn(target.hidden);
  };

  useEffect(() => {
    window.addEventListener('visibilitychange', listen);
    return () => window.removeEventListener('visibilitychange', listen);
  }, []);
}
