# proxyStore
 react hooks redux

## 开发初衷是想要一个轻量化的全局或局部可用的React状态管理工具。
### [npm地址](https://www.npmjs.com/package/hooks-proxy-store)

### 特点：
1. 借鉴Vue的数据劫持方式，ES5采用defineProperty，其他采用Proxy方式。
2. 可以在任意一个地方引用，有丰富的接口去管理依赖。
3. 采用Map管理依赖数组，提升多依赖场景的性能。
4. 采用React Hooks的语法，对useState生成的赋值方法进行劫持。
5. ProxyStore使用了useEffect在页面销毁前进行了依赖删除。
6. 通过数据劫持的方式，可以轻量地创建状态，维护状态，避免redux局部变量变更引起的大面积组件更新从而导致的性能问题。
7. 可以脱离页面组件去使用，通过非页面组件去出发页面组件的更新。
8. 采用TypeScript开发。


### 使用
#### 引入依赖 创建变量
```
  import ProxyStore from 'proxyStore'

  // new ProxyStore() 传入的值为初始值，数据类型可以为 string | number | object | Array<stateValue> | Function | boolean | null | undefined | Map<stateValue, stateValue> | Set<stateValue>`
  export const testState = new ProxyStore({ any: 'any' })
```

#### React组件中使用
```
import React from 'react'

// 引入声明的ProxyStore
import { testState } from '../testStore'

export default React.memo(function renderArea() {
  // 为testState创建名为‘renderArea’的依赖，依赖名必须为字符串，为同一个ProxyState创建同名的依赖会覆盖掉旧依赖。
  const [test, setTest] = testState.addDependency('renderArea')

  function changeValue() {
    // 通过setTest方式修改值，其他引用了testState并添加了依赖的组件会同步更新
    setTest({any: '好好学习'})
  }

  return (
    <>
      <div
        style={{ background: 'blue', height: '100px' }}
        className='title-1 text-center'
        onClick={changeValue}
      >
        // 和普通的state的使用方式一样
        {test.any}
      </div>
    </>
  )
})
```

#### Js中使用
```
// 引入声明的ProxyStore
import { testState } from '../testStore'

function anyFunc() {
  // 通过State获取数据
  const test = testState.state.value

  // 直接修改state也能让依赖了该Store的组件同步更新（不建议），提供setValue方法修改值
  testState.state.value = { any: '我是新的值' } // 不建议该方法
  testState.setValue({ any: '我是新的值' })

  // 可为store添加依赖set(依赖名称，依赖的方法名), 注意手动添加的依赖需要手动清除
  testState.dependency.set('one', oneDependency)

  // 手动清除依赖，
  testState.clean('one')
}

function oneDependency () {
  // any
}

```