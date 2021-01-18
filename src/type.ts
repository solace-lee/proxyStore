
type stateValue = string | number | object | Array<stateValue> | Function | boolean | null | undefined | Map<stateValue, stateValue> | Set<stateValue>

type stateType = {
  value: stateValue,
  dependency?: Map<string, Function>,
  _value?: stateValue
}

type addDependencyFunc = (name: string) => [stateValue, Function]

declare function AddDependency(name: string): [stateValue, Function]

declare class ProxyStore {
  public state: stateType
  public dependency: Map<string, Function>
  public addDependency: addDependencyFunc
  constructor(initValue: stateValue)

  private _init(initValue: stateValue): void
  private _handler(that: any): {
    set: (target: any, key: string, value: stateValue) => boolean
  }

  public clean(key?: string): void
  public setValue(value: stateValue): void
}

interface ProxyStore {
  new(initValue: stateValue): ProxyStore
}

// export { stateValue, stateType, ProxyStore, AddDependency }
