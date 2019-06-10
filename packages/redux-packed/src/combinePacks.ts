import snakeCase from 'lodash.snakecase'
import { combineReducers } from 'redux'

import { actionExtractor } from './symbols'
import { FlatPack, Flatten, FPG, Generics, Middleware } from './types'
import { wrapSelectors } from './utils/wrapSelectors'

type Merge<T extends Record<string, FlatPack>, G extends Generics> = Flatten<
  { [K in keyof T]: FPG<T[K]>[G] }
>

export default function combinePacks<F>(middlewares: Middleware[]) {
  return function<T extends Record<string, FlatPack<any, any, any, F>>>(
    packMap: T,
  ): FlatPack<Merge<T, 0>, Merge<T, 1>, Merge<T, 2>, F> {
    const combinedPack = Object.keys(packMap).reduce<FlatPack>(
      (merged, key) => {
        const pack = packMap[key]
        const constName = snakeCase(key).toUpperCase()
        merged.actions[constName] = pack.actions
        merged.selectors = {
          ...merged.selectors,
          ...wrapSelectors(pack.selectors)((state: Merge<T, 0>) => state[key]),
        }
        return merged
      },
      {
        actions: {},
        selectors: {},
        reducerCreator: (actions) => {
          return combineReducers(
            Object.keys(packMap).reduce(
              (obj, key) => ({
                ...obj,
                [key]: packMap[key].reducerCreator(actions[key], packMap[key].selectors),
              }),
              {},
            ),
          )
        },
        [actionExtractor]: (allActions: Record<keyof T, any>) =>
          Object.keys(packMap).reduce(
            (flatActions, key) => ({
              ...flatActions,
              ...packMap[key][actionExtractor](allActions[key]),
            }),
            {},
          ),
      },
    )
    return middlewares.reduce(
      (result, middleware) => middleware(packMap, result),
      combinedPack,
    )
  }
}
