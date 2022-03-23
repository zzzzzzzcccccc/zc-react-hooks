export declare type Task<T> = () => Promise<T>;
export interface Options<T> {
    count: number;
    onResolved?: (result: T, currentRetryCount: number) => void;
    onRejected?: (error: unknown, currentRetryCount: number) => void;
}
export default function useRetry<T>(task: Task<T>, options: Options<T>): [Task<T>, boolean, any[]];
