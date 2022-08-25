import * as D from "io-ts/Decoder";
import { flow, pipe } from "fp-ts/function";
import { option, eq } from "fp-ts/";
import {
  map as neaMap,
  chain as neaChain,
  head as neaHead,
} from "fp-ts/NonEmptyArray";
import {
  map as arrayMap,
  reduceWithIndex as arrayReduceWithIndex,
} from "fp-ts/Array";
import { IO } from "fp-ts/IO";
import { brand, Branded, string } from "io-ts";

import { Locale, SNEAKY_CASE_REGEX } from "shared/types";

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
 * @param string - string
 * @returns Option with the given string that follows the regex defined in matcher
 * @category String
 */
export const matchC = (matcher: Matcher) => (string: string) =>
  pipe(string.match(matcher), option.fromNullable);

const matchSnakeCase = matchC(SNEAKY_CASE_REGEX);

const isSnakeCase = flow(matchSnakeCase, option.isSome);

//  reduce
const camelCaseString = {
  N: "ano",
  I: "d",
};

// type CharsTuples<Buffer extends string[] =string[], Words extends string[]= string[] > = [Buffer, Words];
type CharsTuples = string[][];
type CharsRecord = {
  buffer: string[];
  words: string[];
};

/**
 * Validates whether given char is delimiter
 * @param delimiter
 * @param string - string
 * @returns CharsRecord
 * @category String
 */
export const isCharDelimiter = (delimiter: string) => (char: string) =>
  eq.eqStrict.equals(char, delimiter);

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
export const concateChars = (strings: string[]) => strings.join("");

//  reduceWithIndex
export const createCharsRecord = (delimiter: string) => (s: string) =>
  pipe(
    [...s],
    arrayReduceWithIndex<string, CharsRecord>(
      { buffer: [], words: [] },
      (charIndex, { buffer, words }, char) => {
        const chars = [...s];
        const isLastChar = charIndex === chars.indexOf(char);

        return {
          buffer: char !== delimiter ? [...buffer, char] : [...buffer],
          words:
            char === delimiter || isLastChar
              ? [...words, concateChars(buffer)]
              : [...words],
        };
      }
    )
  );

// const snakeCaseToPascalCase = flow(matchSnakeCase, optionMap(()))

/**
 * Branded types
 */

/**
 * i18n
 */

//  TODO
/**
 * Creates a locale
 * @param str string that must follow `Locale` type constrains
 */
const createLocale = <S extends string>(str: string): Locale<S> =>
  str as Locale<S>;

const LOCALE_DE = createLocale("cs-CZ");

//  TODO
//  refactor isUrl to work without outside dependecies
const URL_REGEX = /^(https):\/\/[^ "]+$/;

export const isURL = (url: string) =>
  pipe(
    url.match(URL_REGEX),
    option.fromNullableK((res) =>
      !Array.isArray(res) || res.length > 0 ? undefined : res
    ),
    option.isSome
  );

/**
 * IO Utils
 * @param io
 * @returns boolean
 */
export const _isIO = <A>(io: unknown): io is IO<A> => typeof io === "function";

export const getValuefromIO = <A>(funOrVal: A | IO<A>) =>
  _isIO(funOrVal) ? funOrVal() : funOrVal;

//  Decoders
// export const NanoId: D.Decoder<string, T.NanoId> = pipe(
//   D.string,
//   D.refine((s): s is T.NanoId => s.length <= 21, "NanoId")
// );
