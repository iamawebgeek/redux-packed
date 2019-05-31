import { Reducer } from 'redux'
import pick from 'lodash.pick'

import { Flatten } from '../types'

type ReducerStore<T> = T extends Reducer<infer S> ? S : never
type ArrayReducers<T extends Reducer<any>[]> = Array<ReducerStore<T[number]>>
type AllReducers<S extends Reducer<any>[]> = Flatten<ArrayReducers<S>>

export function mergeReducers<S extends Reducer<any>[]>(...reducers: S): Reducer<any> {
  let oldState: AllReducers<S>
  let oldStates: Partial<ArrayReducers<S>> = []
  const keys = reducers.map((reducer) => Object.keys(reducer(undefined, { type: '' })))
  return (state, action) => {
    const isInit = typeof state === 'undefined'
    let modified: boolean = false
    reducers.forEach((reducer, index) => {
      const old = oldStates[index]
      const stateIsSame =
        !old ||
        Object.keys(old).every((key) => old[key] === state[key as keyof typeof state])
      const newState = reducer(stateIsSame ? old : pick(state, keys[index]), action)
      if (isInit || (old && old !== newState)) {
        modified = true
        oldStates[index] = newState
      }
    })
    if (!modified) {
      return oldState
    }
    oldState = oldStates.reduce(
      (current, reducerState, index) => ({
        ...current,
        ...pick(reducerState, keys[index]),
      }),
      {},
    ) as AllReducers<S>
    return oldState
  }
}
