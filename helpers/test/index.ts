import { deepStrictEqual, strictEqual } from "assert";

export const deepStrictEq = <A>(actual: A, expected: A) =>
  deepStrictEqual(actual, expected);

export const strictEq = <A>(actual: A, expected: A) =>
  strictEqual(actual, expected);
