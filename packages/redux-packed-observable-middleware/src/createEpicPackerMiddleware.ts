import { PackMiddleware } from 'redux-packed'
import { combineEpics } from 'redux-observable'

import { FlatPackEpic, PackDataEpic } from './types'

function combine(options): PackDataEpic['epics'] {
  return function(allActions, allSelectors) {
    const packs = Array.isArray(options) ? options : Object.values(options)
    return combineEpics(
      ...packs
        .map((pack) => pack.epics)
        .filter(Boolean)
        .map((epic) => epic(allActions, allSelectors)),
    )
  }
}

export function createEpicPackerMiddleware(): PackMiddleware<PackDataEpic, FlatPackEpic> {
  return {
    create: (pre, post) => ({
      ...post,
      epics: combine(pre),
    }),
    merge: (pre, post) => ({
      ...post,
      epics: combine(pre),
    }),
    extract: (pre, post) => ({
      ...post,
      epics: pre.epics(post.actions, post.selectors),
    }),
    mergeExtracted: (pre, post) => ({
      ...post,
      epics: combineEpics(...pre.map((extractedPack) => extractedPack.epics)),
    }),
  }
}
