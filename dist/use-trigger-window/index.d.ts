export declare type Callback<T> = (payload?: T) => void;
export declare type TriggerWindow<T> = (payload?: T) => void;
export declare const defaultKey = "__useTriggerWindow__";
export default function useTriggerWindow<T extends Object>(fn: Callback<T>, key?: string): [TriggerWindow<T>];
