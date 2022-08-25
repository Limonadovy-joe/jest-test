import { pipe } from "fp-ts/function";

import {
  isCharDelimiter,
  concatenateChars,
  createCharsRecord,
  CharsRecord,
} from "./index";

//  TODO
//  Refactor helpers into corresponding modules - string
describe("shared/helpers/string", () => {
  const NANO_ID = "NANO_ID";
  const nanoIdChars = [...NANO_ID];

  describe("concatenateChars", () => {
    test("Should merge chars into a single string", () => {
      expect(pipe(nanoIdChars, concatenateChars)).toBe("NANO_IDs");
    });
  });
});
