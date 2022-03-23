import { DependencyList, MutableRefObject } from 'react';
export declare type Rect = {
    width: number;
    height: number;
    x: number;
    y: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
};
export default function useRect<T extends HTMLElement>(deps: DependencyList): [Rect, MutableRefObject<T | null>, () => void];
