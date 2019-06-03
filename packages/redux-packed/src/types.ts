import { ActionMap, handleActions } from 'redux-actions'
import { Reducer } from 'redux'

import { actionExtractor } from './symbols'

export type Generics = 0 | 1 | 2
export type PackData<Store = any, AdditionalSelectors = {}, Actions = {}, M = {}> = {
  initial: Store
  actions: ActionMap<any, any>
  selectors?: (selectors: Selectors<Store>) => AdditionalSelectors
  reducerCreator: (
    actions: Actions,
    selectors: Selectors<Store>,
  ) => Parameters<typeof handleActions>[0]
  //epics?: (allActions: any, allSelectors: any) => Epic<any, any, any, any>
  //sagas?: (allActions: any, allSelectors: any) => () => IterableIterator<any>
} & M
export type PackDataGenerics<T> = T extends PackData<infer S, infer AS, infer A>
  ? [S, AS, A]
  : never
export type PDG<T extends PackData> = PackDataGenerics<T>

export type FlatPack<S = any, AS = any, FA = any, M = object> = {
  actions: ActionMap<any, any>
  selectors: AS
  reducerCreator: (actions: FA, selectors: Selectors<S>) => Reducer<S>
  [actionExtractor]: (actions: object) => FA
} & M
export type FlatPackGenerics<T> = T extends FlatPack<infer S, infer AS, infer A, object>
  ? [S, AS, A]
  : never
export type FPG<T extends FlatPack<any, any, any, any>> = FlatPackGenerics<T>

export type ExtractedPack<T extends FlatPack, E = {}> = {
  actions: FPG<T>[2]
  selectors: FPG<T>[1]
  reducer: Reducer<FPG<T>[0]>
} & E
export type EPG<T extends ExtractedPack<FlatPack>> = T extends ExtractedPack<infer FP>
  ? FP
  : never

export type Selector<A, R> = (arg: A, ...otherArgs: any[]) => R
export type InvertibleSelector<A, R = A[keyof A]> = Selector<A, R> & {
  invert: (arg: A, value: R) => void
}
export type Selectors<S, A = S> = { [K in keyof S]: InvertibleSelector<A, S[K]> }
export type SelectorsGenerics<T> = T extends Selectors<infer S, infer A> ? [S, A] : never

export type Middleware<A1 = any, A2 = any, R = any> = (pre: A1, post: A2) => R
export type PackMiddleware<F, E> = {
  create: Middleware<(PackData & F)[], FlatPack, FlatPack<any, any, any, F>>
  merge: Middleware<
    Record<string, FlatPack<any, any, any, F>>,
    FlatPack,
    FlatPack<any, any, any, F>
  >
  extract: Middleware<
    FlatPack<any, any, any, F>,
    ExtractedPack<any>,
    ExtractedPack<any, E>
  >
  mergeExtracted: Middleware<
    ExtractedPack<any, E>[],
    ExtractedPack<any>,
    ExtractedPack<any, E>
  >
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((
  k: infer I,
) => void)
  ? I
  : never
export type Flatten<T> = UnionToIntersection<T[keyof T]>
