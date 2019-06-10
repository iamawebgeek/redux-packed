import { Epic } from 'redux-observable'

export type PackDataEpic = { epics?: (allActions, allSelectors) => Epic }
export type FlatPackEpic = { epics: Epic }
