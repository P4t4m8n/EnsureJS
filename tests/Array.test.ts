import { EnsureArray } from "../src/validators/Array";
import { EnsureString } from "../src/validators/String";
import { EnsureNumber } from "../src/validators/Number";
import { ValidationResult } from "../src/core/types";

describe("EnsureArray", () => {
  let stringArrayValidator: EnsureArray<string>;
  let numberArrayValidator: EnsureArray<number>;

  beforeEach(() => {
    stringArrayValidator = new EnsureArray(new EnsureString());
    numberArrayValidator = new EnsureArray(new EnsureNumber());
  });

  test("should validate an array of strings", () => {
    expect(stringArrayValidator.validate(["hello", "world"])).toEqual<
      ValidationResult<string[]>
    >({
      success: true,
      data: ["hello", "world"],
    });
  });

  test("should validate an array of numbers", () => {
    expect(numberArrayValidator.validate([1, 2, 3])).toEqual<
      ValidationResult<number[]>
    >({
      success: true,
      data: [1, 2, 3],
    });
  });

  test("should fail if input is not an array", () => {
    expect(stringArrayValidator.validate("not an array")).toEqual({
      success: false,
      error: "Expected an array",
    });

    expect(numberArrayValidator.validate(123)).toEqual({
      success: false,
      error: "Expected an array",
    });

    expect(stringArrayValidator.validate(null)).toEqual({
      success: false,
      error: "Expected an array",
    });

    expect(numberArrayValidator.validate(undefined)).toEqual({
      success: false,
      error: "Expected an array",
    });
  });

  test("should fail if any item in the array is invalid", () => {
    expect(stringArrayValidator.validate(["hello", 123])).toEqual({
      success: false,
      error: "Item 1: Expected a string",
    });

    expect(numberArrayValidator.validate([1, "not a number", 3])).toEqual({
      success: false,
      error: "Item 1: Expected an integer",
    });

    expect(numberArrayValidator.validate([1, 2, null])).toEqual({
      success: false,
      error: "Item 2: Expected an integer",
    });
  });

  describe("Nested Arrays", () => {
    test("should validate an array of string arrays", () => {
      const nestedValidator = new EnsureArray(
        new EnsureArray(new EnsureString())
      );
      expect(
        nestedValidator.validate([
          ["a", "b"],
          ["c", "d"],
        ])
      ).toEqual({
        success: true,
        data: [
          ["a", "b"],
          ["c", "d"],
        ],
      });
    });

    test("should fail if a nested array contains invalid data", () => {
      const nestedValidator = new EnsureArray(
        new EnsureArray(new EnsureString())
      );
      expect(
        nestedValidator.validate([
          ["a", "b"],
          [123, "d"],
        ])
      ).toEqual({
        success: false,
        error: "Item 1: Item 0: Expected a string",
      });
    });
  });

  describe("Empty Arrays", () => {
    test("should validate an empty array", () => {
      expect(stringArrayValidator.validate([])).toEqual({
        success: true,
        data: [],
      });
    });
  });
});
