import { eq, option, array } from "fp-ts";
import { Predicate } from "fp-ts/Predicate";
import { pipe, flow } from "fp-ts/function";

import { SNEAKY_CASE_REGEX } from "shared/types";

/**
 * String
 */

type Matcher = {
  [Symbol.match](string: string): RegExpMatchArray | null;
};

//  TODO
//  Reader monad
//  {char: 'n', index: 0, isLast: false}

/**
 * Curried version of native `String.prototype.match` function
 * @param matcher - regex or capture group
 * @param str - string
 * @returns Option with the given string that follows the regex defined in matcher
 * @category String
 */
export const matchC = (matcher: Matcher) => (str: string) =>
  pipe(str.match(matcher), option.fromNullable);

const matchSnakeCase = matchC(SNEAKY_CASE_REGEX);

const isSnakeCase = flow(matchSnakeCase, option.isSome);

//  reduce
const camelCaseString = {
  N: "ano",
  I: "d",
};

// type CharsTuples<Buffer extends string[] =string[], Words extends string[]= string[] > = [Buffer, Words];
type CharsTuples = string[][];
export type CharsRecord = {
  buffer: string[];
  words: string[];
};

/**
 * Validates whether given char is delimiter
 * @param delimiter
 * @param char
 * @returns boolean
 * @category String
 */
export const isCharDelimiter = (delimiter: string, char: string) =>
  eq.eqStrict.equals(char, delimiter);

type CharPositions<T1 extends number = number, T2 extends number = number> = [
  T1,
  T2
];

type AppendTuple<T> = [T, T[]];
/**
 * Validates whether the indexFst is last index
 * @param CharPositions
 * @category String
 */
export const isLastChar = ([indexFst, indexSnd]: CharPositions) =>
  eq.eqStrict.equals(indexFst, indexSnd);

//  Solutions:
//  Imperative + functional API
//    add delimiter to the end of array
//    reduceWithIndex - done
//  Functional
//    splitAt
//    monoid, semigroup

/**
 * Merges an array of string,chars into string
 * @param strings - array of strings, chars
 * @returns string
 * @category String
 */
export const concatenateChars = (strings: string[]) => strings.join("");

//  reduceWithIndex
export const createCharsRecord = (delimiter: string) => (s: string) =>
  pipe(
    [...s],
    array.reduceWithIndex<string, CharsRecord>(
      { buffer: [], words: [] },
      (charIndex, { buffer, words }, char) => {
        const chars = [...s];
        const isLastChar = charIndex === chars.indexOf(char);
        const shouldAppendLastChar = (char: string) =>
          isLastChar
            ? concatenateChars([...buffer, char])
            : concatenateChars([...buffer]);

        return {
          buffer: char !== delimiter ? [...buffer, char] : [],
          words:
            char === delimiter || isLastChar
              ? [...words, concatenateChars(buffer)]
              : [...words],
        };
      }
    )
  );
