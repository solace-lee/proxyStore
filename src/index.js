import { useState, useEffect } from 'react'

function AddDependency(name) {
  // 添加依赖
  const [a, setA] = useState(this.state.value)
  this.dependency.set(name, setA) // 添加依赖

  useEffect(() => {
    return () => {
      this.dependency.delete(name)
    }
  }, [name])

  return [a, (value) => {
    this.state.value = value
  }]
}

class HooksProxyStore {
  dependency
  state
  addDependency = AddDependency
  constructor(initValue) {
    this.dependency = new Map()
    if (!window.Proxy && typeof window.Proxy === 'function') {
      this.state = new Proxy({ value: initValue }, this._handler(this))
    } else {
      this.state = {
        value: undefined,
        dependency: this.dependency,
        _value: undefined
      }
      this._init(initValue)
    }
    return this
  }

  _init(initValue) {
    Object.defineProperty(this.state, 'value', {
      set: function (newValue) {
        for (let func of this.dependency.values()) {
          if (typeof func === 'function') {
            func(newValue)
          }
        }
        this._value = newValue
      },
      get: function () {
        return this._value
      }
    })
    this.state.dependency = this.dependency
    this.state.value = initValue
  }

  _handler(that) {
    return {
      set: function (target, key, value) {
        for (let func of that.dependency.values()) {
          if (typeof func === 'function') {
            func(value)
          }
        }
        target[key] = value
        return true
      }
    }
  }

  clean(key) {
    if (key) {
      this.dependency.delete(key)
    } else {
      this.dependency.clear()
    }
  }

  setValue(value) { // 修改值
    this.state.value = value
  }
}

export default HooksProxyStore