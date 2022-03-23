import { useEffect, useRef } from 'react';

export type CheckPropsState = Record<string, any>;

export type LogType = 'info' | 'log' | 'debug' | 'warn' | 'error';

export default function useWhoUpdated(
  debugComponentName: string,
  checkPropsState: CheckPropsState,
  logType: LogType = 'log',
) {
  const beforeCheckPropsState = useRef<CheckPropsState>({});

  useEffect(() => {
    if (beforeCheckPropsState.current) {
      const keys = Object.keys({ ...beforeCheckPropsState.current, ...checkPropsState });
      const beforeAfterMapper: CheckPropsState = {};

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (beforeCheckPropsState.current[key] !== checkPropsState[key]) {
          beforeAfterMapper[key] = {
            before: beforeCheckPropsState.current[key],
            after: checkPropsState[key],
          };
        }
      }

      console[logType](`useWhoUpdated - ${debugComponentName}`, beforeAfterMapper);
    }

    beforeCheckPropsState.current = checkPropsState;
  });
}
