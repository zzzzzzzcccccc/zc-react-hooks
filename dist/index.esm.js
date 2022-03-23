import { __assign, __awaiter, __generator, __spreadArray, __rest } from 'tslib';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { isPlainObject, isEqual, isArrayLike, debounce } from 'lodash';

function useSetState(initialState) {
    if (!isPlainObject(initialState))
        throw new Error("useSetState initialState not Plain Object");
    var _a = useState(initialState), state = _a[0], setState = _a[1];
    var _setState = function (payload) {
        return setState(function (prevState) { return (__assign(__assign({}, prevState), (payload instanceof Function ? payload(prevState) : payload))); });
    };
    return [state, _setState];
}

function useBooleanState(initialState) {
    var _a = useState(initialState), bool = _a[0], setBool = _a[1];
    return [
        bool,
        {
            toggle: function () { return setBool(!bool); },
            setTrue: function () { return setBool(true); },
            setFalse: function () { return setBool(false); }
        }
    ];
}

function useNextEffect(effect, deps) {
    var isNextMounted = useRef(false);
    useEffect(function () {
        if (!isNextMounted.current) {
            isNextMounted.current = true;
        }
        else {
            return effect();
        }
    }, deps);
}

function useLocalState(key, initialState) {
    if (!key || typeof key !== 'string') {
        throw new Error('useLocalState key must be string');
    }
    var getLocalState = function () {
        try {
            var sessionData = localStorage.getItem(key);
            if (sessionData) {
                return JSON.parse(sessionData);
            }
        }
        catch (e) {
            console.error(e);
        }
        return initialState !== null && initialState !== void 0 ? initialState : undefined;
    };
    var _a = useState(function () { return getLocalState(); }), state = _a[0], setState = _a[1];
    var _setState = function (payload) {
        if (typeof payload === 'undefined') {
            setState(undefined);
            localStorage.removeItem(key);
        }
        else if (payload instanceof Function) {
            try {
                var currentState = payload(state);
                setState(payload);
                localStorage.setItem(key, JSON.stringify(currentState));
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            try {
                setState(payload);
                localStorage.setItem(key, JSON.stringify(payload));
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    useNextEffect(function () {
        setState(getLocalState());
    }, [key]);
    return [state, _setState];
}

function useLast(payload) {
    var ref = useRef(payload);
    ref.current = payload;
    return ref.current;
}

function deepEqual(beforeDeps, afterDeps) {
    if (afterDeps === void 0) { afterDeps = []; }
    return isEqual(beforeDeps, afterDeps);
}
function useDeepEffect(effect, deps) {
    var ref = useRef();
    var diffCountRef = useRef(0);
    if (!deepEqual(deps, ref.current)) {
        ref.current = deps;
        diffCountRef.current += 1;
    }
    useEffect(effect, [diffCountRef.current]);
}

function useMount(fn) {
    if (typeof fn !== "function") {
        throw new Error("useMount must be a function");
    }
    var fnLast = useLast(fn);
    useEffect(function () {
        fnLast();
    }, []);
}

function useUnmount(fn) {
    if (typeof fn !== 'function') {
        throw new Error('useUnmount payload must be function');
    }
    var fnLast = useLast(fn);
    useEffect(function () {
        return function () { return fnLast(); };
    }, []);
}

function useRetry(task, options) {
    var _this = this;
    var _a = options.count, count = _a === void 0 ? 3 : _a, onResolved = options.onResolved, onRejected = options.onRejected;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState([]), errorList = _c[0], setErrorList = _c[1];
    var retryCountRef = useRef(count);
    var retriedCountRef = useRef(0);
    if (count <= 0)
        throw new Error('useRetry count <= 0');
    var clear = function () {
        setLoading(false);
        retriedCountRef.current = 0;
        retryCountRef.current = count;
    };
    var addError = function (e) { return setErrorList(__spreadArray(__spreadArray([], errorList, true), [e], false)); };
    var clearError = function () { return setErrorList([]); };
    var runTasks = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (retriedCountRef.current <= 0)
                        clearError();
                    retriedCountRef.current++;
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 7]);
                    return [4 /*yield*/, task()];
                case 2:
                    result = _a.sent();
                    onResolved === null || onResolved === void 0 ? void 0 : onResolved(result, retryCountRef.current);
                    clear();
                    return [2 /*return*/, result];
                case 3:
                    e_1 = _a.sent();
                    addError(e_1);
                    onRejected === null || onRejected === void 0 ? void 0 : onRejected(e_1, retriedCountRef.current);
                    if (!(retriedCountRef.current >= retryCountRef.current)) return [3 /*break*/, 4];
                    clear();
                    return [2 /*return*/, Promise.reject(e_1)];
                case 4: return [4 /*yield*/, runTasks()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return [runTasks, loading, errorList];
}

var initialRect = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
};
function useRect(deps) {
    if (!deps || !isArrayLike(deps)) {
        throw new Error('useRect deps must be array');
    }
    var wrapperRef = useRef(null);
    var _a = useState(initialRect), rect = _a[0], setRect = _a[1];
    var setCurrentRect = function () {
        var _a;
        var _rect = (_a = wrapperRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (_rect) {
            setRect(_rect);
        }
    };
    useEffect(function () {
        setCurrentRect();
    }, deps);
    return [rect, wrapperRef, setCurrentRect];
}

var initialOptions = {
    wait: 300,
    ignoreDebounce: true
};
function useWindowResize(fn, options) {
    if (options === void 0) { options = initialOptions; }
    var wait = options.wait, ignoreDebounce = options.ignoreDebounce, rest = __rest(options, ["wait", "ignoreDebounce"]);
    var _a = useState({ width: 0, height: 0 }), windowSize = _a[0], setWindowSize = _a[1];
    var listenerResize = function (e) {
        var action = function () {
            fn === null || fn === void 0 ? void 0 : fn(e);
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        ignoreDebounce ? action() : debounce(action, wait, rest);
    };
    useLayoutEffect(function () {
        window.addEventListener("resize", listenerResize);
        return function () { return window.removeEventListener("resize", listenerResize); };
    }, []);
    return [windowSize];
}

var defaultKey = '__useTriggerWindow__';
function useTriggerWindow(fn, key) {
    if (key === void 0) { key = defaultKey; }
    var triggerWindow = function (payload) {
        if (payload && !isPlainObject(payload)) {
            throw new Error('useTriggerWindow triggerWindow payload not Plain Object');
        }
        var noticeData = { message: payload, triggerTime: Date.now() };
        sessionStorage.setItem(key, JSON.stringify(noticeData));
    };
    var onStorage = function (e) {
        if (e.key !== key)
            return;
        try {
            var sessionData = JSON.parse(e.newValue || '');
            fn(sessionData === null || sessionData === void 0 ? void 0 : sessionData.message);
        }
        catch (e) {
            throw e;
        }
    };
    useEffect(function () {
        window.addEventListener('storage', onStorage);
        return function () { return window.removeEventListener('storage', onStorage); };
    }, []);
    return [triggerWindow];
}

function useWhoUpdated(debugComponentName, checkPropsState, logType) {
    if (logType === void 0) { logType = 'log'; }
    var beforeCheckPropsState = useRef({});
    useEffect(function () {
        if (beforeCheckPropsState.current) {
            var keys = Object.keys(__assign(__assign({}, beforeCheckPropsState.current), checkPropsState));
            var beforeAfterMapper = {};
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (beforeCheckPropsState.current[key] !== checkPropsState[key]) {
                    beforeAfterMapper[key] = {
                        before: beforeCheckPropsState.current[key],
                        after: checkPropsState[key],
                    };
                }
            }
            console[logType]("useWhoUpdated - ".concat(debugComponentName), beforeAfterMapper);
        }
        beforeCheckPropsState.current = checkPropsState;
    });
}

export { useBooleanState, useDeepEffect, useLast, useLocalState, useMount, useNextEffect, useRect, useRetry, useSetState, useTriggerWindow, useUnmount, useWhoUpdated, useWindowResize };
