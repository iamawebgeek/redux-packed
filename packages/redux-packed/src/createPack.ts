import { handleActions } from 'redux-actions'
import {
  Middleware,
  FlatPack,
  PackData,
  PDG,
  Selectors,
  Flatten,
  Generics,
} from './types'
import { createSelectors } from './utils/createSelectors'
import { actionExtractor } from './symbols'

type CastedToObject<T extends PackData[], G extends Generics> = {
  [key: number]: PDG<T[number]>[G]
}
type Merge<T extends PackData[], G extends Generics> = Flatten<CastedToObject<T, G>>

export default function createPack<F>(middlewares: Middleware[]) {
  return function<T extends PackData<any, any, any>[]>(
    allParts: T,
  ): FlatPack<Merge<T, 0>, Merge<T, 1> & Selectors<Merge<T, 0>>, Merge<T, 2>, F> {
    const { initial, actions, selectors, reducerCreator } = allParts.reduce<
      Partial<PackData>
    >(
      (merged, current) => ({
        initial: { ...merged.initial, ...current.initial },
        actions: { ...merged.actions, ...current.actions },
        reducerCreator: (...args) => ({
          ...merged.reducerCreator(...args),
          ...current.reducerCreator(...args),
        }),
        selectors: (...args) => ({
          ...merged.selectors(...args),
          ...(current.selectors ? current.selectors(...args) : {}),
        }),
      }),
      {
        reducerCreator: () => ({}),
        selectors: () => ({}),
      },
    )
    const initialSelectors = createSelectors(initial)
    const additionalSelectors = selectors(initialSelectors) as Merge<T, 0>
    return middlewares.reduce((result, middleware) => middleware(allParts, result), {
      actions,
      selectors: { ...initialSelectors, ...additionalSelectors },
      reducerCreator: (...args) => handleActions(reducerCreator(...args), initial),
      [actionExtractor]: (actions: Merge<T, 2>) => actions,
    } as FlatPack<Merge<T, 0>, Merge<T, 1> & Selectors<Merge<T, 0>>, Merge<T, 2>, F>)
  }
}
