import { EnsureObject } from "../src/validators/Object";
import { EnsureString } from "../src/validators/String";
import { EnsureNumber } from "../src/validators/Number";
import { EnsureInteger } from "../src/validators/Integer";
import { ValidationResult } from "../src/core/types";

describe("EnsureObject", () => {
  let userValidator: EnsureObject<{ name: string; age: number }>;

  beforeEach(() => {
    userValidator = new EnsureObject<{ name: string; age: number }>({
      name: new EnsureString(),
      age: new EnsureNumber().min(18).max(100),
    });
  });

  test("should validate a correct object", () => {
    expect(userValidator.validate({ name: "Alice", age: 25 })).toEqual<
      ValidationResult<{ name: string; age: number }>
    >({
      success: true,
      data: { name: "Alice", age: 25 },
    });
  });

  test("should fail if input is not an object", () => {
    expect(userValidator.validate(null)).toEqual({
      success: false,
      error: "Expected an object",
    });

    expect(userValidator.validate("not an object")).toEqual({
      success: false,
      error: "Expected an object",
    });

    expect(userValidator.validate(123)).toEqual({
      success: false,
      error: "Expected an object",
    });

    expect(userValidator.validate([])).toEqual({
      success: false,
      error: "Expected an object",
    });
  });

  test("should fail if a required field is missing", () => {
    expect(userValidator.validate({ name: "Alice" })).toEqual({
      success: false,
      error: 'Field "age": Expected an integer',
    });

    expect(userValidator.validate({ age: 30 })).toEqual({
      success: false,
      error: 'Field "name": Expected a string',
    });
  });

  test("should fail if a field has an invalid type", () => {
    expect(userValidator.validate({ name: 123, age: 25 })).toEqual({
      success: false,
      error: 'Field "name": Expected a string',
    });

    expect(userValidator.validate({ name: "Alice", age: "twenty" })).toEqual({
      success: false,
      error: 'Field "age": Expected an integer',
    });
  });

  test("should fail if a field violates validation rules", () => {
    expect(userValidator.validate({ name: "Alice", age: 15 })).toEqual({
      success: false,
      error: 'Field "age": Value must be at least 18',
    });

    expect(userValidator.validate({ name: "Alice", age: 110 })).toEqual({
      success: false,
      error: 'Field "age": Value must be at most 100',
    });
  });

  describe("Nested Objects", () => {
    let personValidator: EnsureObject<{
      name: string;
      address: { street: string; zip: number };
    }>;

    beforeEach(() => {
      personValidator = new EnsureObject<{
        name: string;
        address: { street: string; zip: number };
      }>({
        name: new EnsureString(),
        address: new EnsureObject({
          street: new EnsureString(),
          zip: new EnsureInteger().min(10000).max(99999),
        }),
      });
    });

    test("should validate a nested object", () => {
      expect(
        personValidator.validate({
          name: "John",
          address: { street: "Main St", zip: 12345 },
        })
      ).toEqual({
        success: true,
        data: { name: "John", address: { street: "Main St", zip: 12345 } },
      });
    });

    test("should fail if a nested field is invalid", () => {
      expect(
        personValidator.validate({
          name: "John",
          address: { street: "Main St", zip: "wrong type" },
        })
      ).toEqual({
        success: false,
        error: 'Field "address": Field "zip": Expected an integer',
      });
    });

    test("should fail if a nested field is missing", () => {
      expect(
        personValidator.validate({
          name: "John",
          address: { zip: 12345 },
        })
      ).toEqual({
        success: false,
        error: 'Field "address": Field "street": Expected a string',
      });
    });
  });

  describe("Empty Schema", () => {
    test("should validate an empty object if schema has no fields", () => {
      const emptyValidator = new EnsureObject({});
      expect(emptyValidator.validate({})).toEqual({
        success: true,
        data: {},
      });
    });

    test("should fail if object is not empty when schema is empty", () => {
      const emptyValidator = new EnsureObject({});
      expect(emptyValidator.validate({ unexpected: "field" })).toEqual({
        success: false,
        error: 'Field "unexpected": undefined is not a function',
      });
    });
  });
});
