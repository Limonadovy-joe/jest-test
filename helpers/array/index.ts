import { Predicate } from "fp-ts/Predicate";

/**
 * Appends val to the array if the val satisfies the predicate, otherwise it returns arr
 * @param val value to be appended
 * @category Array
 */
export const shouldAppend =
  <A>(val: A) =>
  (predicate: Predicate<A>) =>
  (arr: Array<A>) =>
    predicate(val) ? [...arr, val] : [...arr];
