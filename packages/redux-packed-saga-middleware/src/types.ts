export type PackDataSaga = {
  sagas?: (allActions, allSelectors) => () => IterableIterator<any>
}
export type FlatPackSaga = { sagas: () => IterableIterator<any> }
