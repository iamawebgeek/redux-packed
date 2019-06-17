import { PackMiddleware } from 'redux-packed'
import { all } from 'redux-saga/effects'

import { FlatPackSaga, PackDataSaga } from './types'

function combine(options): PackDataSaga['sagas'] {
  return function(...args) {
    return iterator(options, ...args)
  }
}

function iterator(options, ...args) {
  return function*() {
    const packs = Array.isArray(options) ? options : Object.values(options)
    yield all(
      packs
        .map((pack) => pack.sagas)
        .filter(Boolean)
        .map((saga) => saga(...args)),
    )
  }
}

export function createSagaPackerMiddleware(): PackMiddleware<PackDataSaga, FlatPackSaga> {
  return {
    create: (pre, post) => ({
      ...post,
      sagas: combine(pre),
    }),
    merge: (pre, post) => ({
      ...post,
      sagas: combine(pre),
    }),
    extract: (pre, post) => ({
      ...post,
      sagas: pre.sagas(post.actions, post.selectors),
    }),
    mergeExtracted: (pre, post) => ({
      ...post,
      sagas: iterator(pre),
    }),
  }
}
