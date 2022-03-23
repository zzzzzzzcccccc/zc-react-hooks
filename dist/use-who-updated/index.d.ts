export declare type CheckPropsState = Record<string, any>;
export declare type LogType = 'info' | 'log' | 'debug' | 'warn' | 'error';
export default function useWhoUpdated(debugComponentName: string, checkPropsState: CheckPropsState, logType?: LogType): void;
