import produce from 'immer'
import { ActionMeta, ReducerMeta } from 'redux-actions'

import { InvertibleSelector, SelectorsGenerics } from '../types'

type Updater<S> = (value: S, action: ActionMeta<any, any>) => S

export function updateState<T extends InvertibleSelector<any, any>>(
  selectors: T | T[],
  updater: Updater<ReturnType<T>>,
): ReducerMeta<SelectorsGenerics<T>[0], any, any> {
  return (state, action) =>
    produce(state, (draftState) => {
      selectors = Array.isArray(selectors) ? selectors : [selectors]
      selectors.forEach((selector) => {
        const newValue = updater(selector(draftState), action)
        selector.invert(draftState, newValue)
      })
    })
}
