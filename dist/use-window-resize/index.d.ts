export declare type Options = {
    wait: number;
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
    ignoreDebounce?: boolean;
};
export declare type CallbackFunction = (e: UIEvent) => void;
export interface WindowSize {
    width: number;
    height: number;
}
export default function useWindowResize(fn?: CallbackFunction, options?: Options): [WindowSize];
