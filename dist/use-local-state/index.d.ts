declare type SetState<State> = (state: State | undefined | ((prevState?: State) => State)) => void;
export default function useLocalState<State>(key: string, initialState?: State): [State | undefined, SetState<State>];
export {};
