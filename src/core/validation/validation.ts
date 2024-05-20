export interface Validation<T> {
  parse: (input: object | undefined) => T
}
