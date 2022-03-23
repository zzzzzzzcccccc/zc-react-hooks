declare type SetState<S extends Record<string, any>> = <K extends keyof S>(state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null)) => void;
export default function useSetState<State extends Record<string, any>>(initialState: State): [State, SetState<State>];
export {};
