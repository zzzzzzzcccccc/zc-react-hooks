declare type Patch = {
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
};
export default function useBooleanState(initialState: boolean): [boolean, Patch];
export {};
