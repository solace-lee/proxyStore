
type stateValue = string | number | object | Array<stateValue> | Function | boolean | null | undefined | Map<stateValue, stateValue> | Set<stateValue>

type stateType = {
  value: stateValue,
  dependency?: Map<string, Function>,
  _value?: stateValue
}

declare class ProxyStore {
  constructor(initValue: stateValue);
  dependency: Map<string, Function>;
  state: stateType;
  addDependency: typeof AddDependency;
  _init(initValue: stateValue): void;
  _handler(that: any): {
    set: (target: any, key: string, value: stateValue) => boolean;
  };
  clean(key?: string): void;
  setValue(value: stateValue): void;
}
declare function AddDependency(this: any, name: string): [stateValue, Function];

export default ProxyStore;

