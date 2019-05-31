import { Selectors } from '../types'

export function createSelectors<S extends Record<string, any>>(initial: S): Selectors<S> {
  return Object.keys(initial).reduce((obj, key) => {
    const selector = (state: S) => state[key]
    selector.invert = (state: S, value: S[keyof S]) => {
      state[key] = value
    }
    return { ...(obj as object), [key]: selector } as any
  }, {})
}
