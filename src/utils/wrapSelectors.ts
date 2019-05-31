import { Selectors, SelectorsGenerics } from '../types'

export function wrapSelectors<S extends Selectors<any, any> = any>(selectors: S) {
  return <NewArg>(wrapper: (a: NewArg) => SelectorsGenerics<S>[0]) =>
    Object.keys(selectors).reduce<Partial<Selectors<SelectorsGenerics<S>[0], NewArg>>>(
      (wrapped, key) => {
        return {
          ...(wrapped as object),
          [key]: (arg: NewArg, ...otherArgs: any[]) =>
            selectors[key](wrapper(arg), ...otherArgs),
        } as any
      },
      {},
    ) as Selectors<SelectorsGenerics<S>[0], NewArg>
}
