import { EnsureNumber } from "../src/validators/Number";
import { ValidationResult } from "../src/core/types";

describe("EnsureNumber", () => {
  let numberValidator: EnsureNumber;

  beforeEach(() => {
    numberValidator = new EnsureNumber();
  });

  test("should validate a valid number", () => {
    expect(numberValidator.validate(10)).toEqual<ValidationResult<number>>({
      success: true,
      data: 10,
    });

    expect(numberValidator.validate(-5)).toEqual<ValidationResult<number>>({
      success: true,
      data: -5,
    });
  });

  test("should fail if value is not a number", () => {
    expect(numberValidator.validate("10")).toEqual({
      success: false,
      error: "Expected an integer",
    });

    expect(numberValidator.validate(null)).toEqual({
      success: false,
      error: "Expected an integer",
    });

    expect(numberValidator.validate(undefined)).toEqual({
      success: false,
      error: "Expected an integer",
    });

    expect(numberValidator.validate({})).toEqual({
      success: false,
      error: "Expected an integer",
    });
    expect(numberValidator.validate([])).toEqual({
      success: false,
      error: "Expected an integer",
    });
  });

  describe("Min Value Validation", () => {
    test("should pass if number meets min value", () => {
      const validator = new EnsureNumber().min(5);
      expect(validator.validate(5)).toEqual({
        success: true,
        data: 5,
      });
      expect(validator.validate(10)).toEqual({
        success: true,
        data: 10,
      });
    });

    test("should fail if number is below min value", () => {
      const validator = new EnsureNumber().min(5);
      expect(validator.validate(4)).toEqual({
        success: false,
        error: "Value must be at least 5",
      });

      expect(validator.validate(-1)).toEqual({
        success: false,
        error: "Value must be at least 5",
      });
    });
  });

  describe("Max Value Validation", () => {
    test("should pass if number is within max value", () => {
      const validator = new EnsureNumber().max(10);
      expect(validator.validate(10)).toEqual({
        success: true,
        data: 10,
      });
      expect(validator.validate(5)).toEqual({
        success: true,
        data: 5,
      });
    });

    test("should fail if number exceeds max value", () => {
      const validator = new EnsureNumber().max(10);
      expect(validator.validate(11)).toEqual({
        success: false,
        error: "Value must be at most 10",
      });

      expect(validator.validate(20)).toEqual({
        success: false,
        error: "Value must be at most 10",
      });
    });
  });

  describe("Min & Max Validation Together", () => {
    test("should pass if number is within range", () => {
      const validator = new EnsureNumber().min(5).max(15);
      expect(validator.validate(10)).toEqual({
        success: true,
        data: 10,
      });
      expect(validator.validate(5)).toEqual({
        success: true,
        data: 5,
      });
      expect(validator.validate(15)).toEqual({
        success: true,
        data: 15,
      });
    });

    test("should fail if number is outside range", () => {
      const validator = new EnsureNumber().min(5).max(15);
      expect(validator.validate(4)).toEqual({
        success: false,
        error: "Value must be at least 5",
      });

      expect(validator.validate(16)).toEqual({
        success: false,
        error: "Value must be at most 15",
      });
    });
  });
});
