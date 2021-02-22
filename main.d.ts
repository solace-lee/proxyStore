declare type stateValue = any;
declare type stateType = {
  value: stateValue;
  dependency?: Map<string, Function>;
  _value?: stateValue;
};
declare class HooksProxyStore {
  dependency: Map<string, Function>;
  state: stateType;
  addDependency: typeof AddDependency
  constructor(initValue: stateValue);
  private _init(initValue: stateValue): void;
  private _handler(that: any): {
    set: (target: any, key: string, value: stateValue) => boolean;
  };
  clean(key?: string): void;
  setValue(value: stateValue): void;
  getValue(): stateValue;
}
declare function AddDependency(this: any, name: string): [stateValue, Function];
export default HooksProxyStore;
