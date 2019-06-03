import { EPG, ExtractedPack, FlatPack, Flatten, FPG, Generics, Middleware } from './types'
import { mergeReducers } from './utils/mergeReducers'

type CastedToObject<T extends ExtractedPack<FlatPack>[]> = {
  [key: number]: EPG<T[number]>
}
type MergeFP<T extends Record<number, FlatPack>, G extends Generics> = Flatten<
  { [K in keyof T]: FPG<T[K]>[G] }
>
type Merge<T extends ExtractedPack<FlatPack>[]> = FlatPack<
  MergeFP<CastedToObject<T>, 0>,
  MergeFP<CastedToObject<T>, 1>,
  MergeFP<CastedToObject<T>, 2>,
  object
>

export function mergeExtractedPacks<E>(middlewares: Middleware[]) {
  return function<T extends ExtractedPack<any>[]>(
    ...extractedPacks: T
  ): ExtractedPack<Merge<T>, E> {
    return middlewares.reduce(
      (result, middleware) => middleware(extractedPacks, result),
      {
        reducer: mergeReducers(...extractedPacks.map((resource) => resource.reducer)),
        actions: extractedPacks.reduce(
          (current, resource) => ({ ...current, ...resource.actions }),
          {},
        ),
        selectors: extractedPacks.reduce(
          (current, resource) => ({ ...current, ...resource.selectors }),
          {},
        ),
      },
    )
  }
}
