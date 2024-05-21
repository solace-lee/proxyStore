declare type stateValue = any;
declare type stateType = {
    value: stateValue;
    dependency?: Map<string, Function>;
    _value?: stateValue;
};
declare class HooksProxyStore {
    dependency: Map<string, Function>;
    state: stateType;
    addDependency: Function;
    useDependency: Function;
    constructor(initValue: stateValue);
    private _init;
    private _handler;
    clean(key?: string): void;
    setValue(value: stateValue): void;
    getValue(): stateValue;
}
export default HooksProxyStore;
