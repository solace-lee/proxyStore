import { useState, useEffect, useRef } from "react";

// type stateValue = string | number | object | Array<stateValue> | Function | boolean | null | undefined | Map<stateValue, stateValue> | Set<stateValue>
type stateValue = any;

type stateType = {
  value: stateValue;
  dependency?: Map<string, Function>;
  _value?: stateValue;
};

function AddDependency(
  this: HooksProxyStore,
  name: string,
  late = false
): [stateValue, Function] {
  // 添加依赖
  const [a, setA] = useState(this.state.value);
  const isMounted = useRef(true);
  if (late) {
    this.dependency.set(name, (value: stateValue) => {
      setTimeout(() => {
        if (isMounted.current) {
          setA(value);
        }
      });
    }); // 添加依赖
  } else {
    this.dependency.set(name, (value: stateValue) => {
      if (isMounted.current) {
        setA(value);
      }
    }); // 添加依赖
  }

  useEffect(() => {
    return () => {
      isMounted.current = false;
      this.dependency.delete(name);
    };
  }, [name]);

  return [
    a,
    (value: stateValue) => {
      this.state.value = value;
    },
  ];
}

class HooksProxyStore {
  public dependency: Map<string, Function>;
  public state: stateType;
  public addDependency: Function = AddDependency;
  constructor(initValue: stateValue) {
    this.dependency = new Map();
    if (window.Proxy && typeof window.Proxy === "function") {
      this.state = new Proxy({ value: initValue }, this._handler(this));
    } else {
      this.state = {
        value: undefined,
        dependency: this.dependency,
        _value: undefined,
      };
      this._init(initValue);
    }
    return this;
  }

  private _init(initValue: stateValue) {
    Object.defineProperty(this.state, "value", {
      set: function (newValue: stateValue) {
        if (this._value !== newValue) {
          this._value = newValue;
          this.dependency.forEach((func: Function) => {
            if (typeof func === "function") {
              func(newValue);
            }
          });
        }
      },
      get: function () {
        return this._value;
      },
    });
    this.state.dependency = this.dependency;
    this.state.value = initValue;
  }

  private _handler(that: any) {
    return {
      set: function (target: any, key: string, value: stateValue) {
        if (target[key] !== value) {
          target[key] = value;
          that.dependency.forEach((func: Function) => {
            if (typeof func === "function") {
              func(value);
            }
          });
        }
        return true;
      },
    };
  }

  public clean(key?: string) {
    if (key) {
      this.dependency.delete(key);
    } else {
      this.dependency.clear();
    }
  }

  public setValue(value: stateValue) {
    // 修改值
    this.state.value = value;
  }

  public getValue(): stateValue {
    // 获取值
    return this.state.value;
  }
}

export default HooksProxyStore;
