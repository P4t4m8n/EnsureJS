import { EnsureDouble } from "../src/validators/Double";
import { ValidationResult } from "../src/core/types";

describe("EnsureDouble", () => {
  let doubleValidator: EnsureDouble;

  beforeEach(() => {
    doubleValidator = new EnsureDouble();
  });

  test("should validate a floating-point number (double)", () => {
    expect(doubleValidator.validate(10.5)).toEqual<ValidationResult<number>>({
      success: true,
      data: 10.5,
    });

    expect(doubleValidator.validate(-3.14)).toEqual<ValidationResult<number>>({
      success: true,
      data: -3.14,
    });
  });

  test("should fail if value is not a number", () => {
    expect(doubleValidator.validate("10.5")).toEqual({
      success: false,
      error: "Expected an integer",
    });

    expect(doubleValidator.validate(null)).toEqual({
      success: false,
      error: "Expected an integer",
    });

    expect(doubleValidator.validate(undefined)).toEqual({
      success: false,
      error: "Expected an integer",
    });

    expect(doubleValidator.validate({})).toEqual({
      success: false,
      error: "Expected an integer",
    });
  });

  test("should fail if number is an integer", () => {
    expect(doubleValidator.validate(10)).toEqual({
      success: false,
      error: "Expected a double (floating-point number)",
    });

    expect(doubleValidator.validate(0)).toEqual({
      success: false,
      error: "Expected a double (floating-point number)",
    });

    expect(doubleValidator.validate(-5)).toEqual({
      success: false,
      error: "Expected a double (floating-point number)",
    });
  });

  describe("Min and Max Validation", () => {
    test("should pass if double is within min and max range", () => {
      const validator = new EnsureDouble().min(1.5).max(5.5);
      expect(validator.validate(2.5)).toEqual({
        success: true,
        data: 2.5,
      });

      expect(validator.validate(5.5)).toEqual({
        success: true,
        data: 5.5,
      });
    });

    test("should fail if double is below min value", () => {
      const validator = new EnsureDouble().min(2.5);
      expect(validator.validate(2.4)).toEqual({
        success: false,
        error: "Value must be at least 2.5",
      });
    });

    test("should fail if double is above max value", () => {
      const validator = new EnsureDouble().max(5.5);
      expect(validator.validate(5.6)).toEqual({
        success: false,
        error: "Value must be at most 5.5",
      });
    });
  });
});
