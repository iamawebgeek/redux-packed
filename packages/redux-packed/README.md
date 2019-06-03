# redux-packed

Modularize your redux code into small packs, combine and extract for final usage.


[![](https://img.shields.io/npm/v/redux-packed.svg)](https://www.npmjs.com/package/redux-packed)
[![](https://img.shields.io/npm/dt/redux-packed.svg)](https://www.npmjs.com/package/redux-packed)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/iamawebgeek/redux-packed/blob/master/LICENSE)


## Installation
Installing using node package manager.
Type the following in your console inside your project directory:
```
npm install redux-packed --save
```

With yarn:
```
yarn add redux-packed
```

## Usage

```typescript
import { createPacker, updateState, PackData } from 'redux-packed'

const { createPack, combinePacks, extractPack } = createPacker([])

type Store = {
  count: number
}

type Actions = {
  increment: () => ({ type: string })
  decrement: () => ({ type: string })
}

type Packs = [PackData<Store, {}, Actions>]

const pack = createPack<Packs>([
  {
    initial: {
      count: 0,
    },
    actions: {
      INCREMENT: undefined,
      DECREMENT: undefined,
    },
    reducerCreator: (actions, selectors) => ({
      [`${actions.increment}`]: updateState(selectors.count, (value) => value + 1),
      [`${actions.decrement}`]: updateState(selectors.count, (value) => value - 1),
    }),
  },
])

const combinedPack = combinePacks({
  moduleA: pack,
})

const { actions, reducer, selectors } = extractPack(combinedPack)

const store = createStore(reducer)

store.dispatch(actions.increment()) // Dispatch action with type MODULE_A/INCREMENT
console.log(selectors.count(store.getState())) // 1
```
