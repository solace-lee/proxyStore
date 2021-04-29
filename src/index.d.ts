declare type stateValue = any;
declare type stateType = {
    value: stateValue;
    dependency?: Map<string, Function>;
    _value?: stateValue;
};
declare class HooksProxyStore {
    dependency: Map<string, Function>;
    state: stateType;
    addDependency: typeof AddDependency;
    constructor(initValue: stateValue);
    private _init;
    private _handler;
    clean(key?: string): void;
    setValue(value: stateValue): void;
    getValue(): stateValue;
}
declare function AddDependency(this: any, name: string, late?: boolean): [stateValue, Function];
export default HooksProxyStore;
