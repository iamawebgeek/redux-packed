import { PackMiddleware } from './types'
import createPack from './createPack'
import combinePacks from './combinePacks'
import extractPack from './extractPack'
import mergeExtractedPacks from './mergeExtractedPacks'

export const createPacker = <F, E>(middlewares?: PackMiddleware<F, E>[] = []) => {
  return {
    createPack: createPack<F>(middlewares.map((middleware) => middleware.create)),
    combinePacks: combinePacks<F>(middlewares.map((middleware) => middleware.merge)),
    extractPack: extractPack<E>(middlewares.map((middleware) => middleware.extract)),
    mergeExtractedPacks: mergeExtractedPacks<E>(
      middlewares.map((middleware) => middleware.mergeExtracted),
    ),
  }
}
