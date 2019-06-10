import { createActions } from 'redux-actions'
import { ExtractedPack, FlatPack, Middleware } from './types'
import { actionExtractor } from './symbols'

export default function extractPack<E>(middlewares: Middleware[]) {
  return function<T extends FlatPack>(pack: T): ExtractedPack<T, E> {
    const { actions, selectors, reducerCreator } = pack
    const allActions = createActions(actions)
    const reducer = reducerCreator(allActions, selectors)
    const flatActions = pack[actionExtractor](allActions)
    return middlewares.reduce((result, middleware) => middleware(pack, result), {
      actions: flatActions,
      reducer,
      selectors,
    })
  }
}
