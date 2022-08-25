import { pipe } from "fp-ts/function";

import { deepStrictEq } from "shared/helpers/test";
import { MOCK_CHARS, MOCK_CHAR_X, MOCK_CHARS_WITH_X } from "./mocks";
import { shouldAppend } from "./index";

describe("shared/helpers/array", () => {
  describe("shouldAppend", () => {
    test("Should append char - X if the predicate is true", () => {
      const shouldAppendX = shouldAppend(MOCK_CHAR_X);

      expect(
        pipe(
          MOCK_CHARS,
          shouldAppendX((x) => x === "X")
        )
      ).toEqual(MOCK_CHARS_WITH_X);
    });

    test("Should not append char - X if the predicate is false", () => {
      const shouldAppendX = shouldAppend(MOCK_CHAR_X);

      console.log("2 case", MOCK_CHARS);

      return deepStrictEq(
        pipe(
          MOCK_CHARS,
          shouldAppendX((x) => x === "Y")
        ),
        MOCK_CHARS
      );

      expect(
        pipe(
          MOCK_CHARS,
          shouldAppendX((x) => x === "Y")
        )
      ).toEqual(MOCK_CHARS);
    });
  });
});
