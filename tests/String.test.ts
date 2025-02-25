import { EnsureString } from "../src/validators/String";
import { ValidationResult } from "../src/core/types";

describe("EnsureString", () => {
  let stringValidator: EnsureString;

  beforeEach(() => {
    stringValidator = new EnsureString();
  });

  test("should validate a normal string", () => {
    expect(stringValidator.validate("hello")).toEqual<ValidationResult<string>>(
      {
        success: true,
        data: "hello",
      }
    );
  });

  test("should fail if value is not a string", () => {
    expect(stringValidator.validate(123)).toEqual({
      success: false,
      error: "Expected a string",
    });
    expect(stringValidator.validate(-123)).toEqual({
      success: false,
      error: "Expected a string",
    });
    expect(stringValidator.validate(0)).toEqual({
      success: false,
      error: "Expected a string",
    });

    expect(stringValidator.validate(null)).toEqual({
      success: false,
      error: "Expected a string",
    });

    expect(stringValidator.validate(undefined)).toEqual({
      success: false,
      error: "Expected a string",
    });

    expect(stringValidator.validate({})).toEqual({
      success: false,
      error: "Expected a string",
    });
    expect(stringValidator.validate([])).toEqual({
      success: false,
      error: "Expected a string",
    });
  });

  describe("Min Length Validation", () => {
    test("should validate when string meets minimum length", () => {
      const validator = new EnsureString().min(3);
      expect(validator.validate("hello")).toEqual({
        success: true,
        data: "hello",
      });
    });

    test("should fail when string is shorter than minimum length", () => {
      const validator = new EnsureString().min(6);
      expect(validator.validate("hello")).toEqual({
        success: false,
        error: "String must be at least 6 characters long",
      });
    });
  });

  describe("Max Length Validation", () => {
    test("should validate when string is within maximum length", () => {
      const validator = new EnsureString().max(10);
      expect(validator.validate("hello")).toEqual({
        success: true,
        data: "hello",
      });
    });

    test("should fail when string exceeds maximum length", () => {
      const validator = new EnsureString().max(4);
      expect(validator.validate("hello")).toEqual({
        success: false,
        error: "String must be at most 4 characters long",
      });
    });
  });

  describe("Email Validation", () => {
    test("should validate a correct email", () => {
      const validator = new EnsureString().email();
      expect(validator.validate("test@example.com")).toEqual({
        success: true,
        data: "test@example.com",
      });
    });

    test("should fail for an invalid email", () => {
      const validator = new EnsureString().email();
      expect(validator.validate("invalid-email")).toEqual({
        success: false,
        error: "Invalid email address",
      });

      expect(validator.validate("test@.com")).toEqual({
        success: false,
        error: "Invalid email address",
      });

      expect(validator.validate("@example.com")).toEqual({
        success: false,
        error: "Invalid email address",
      });
    });
  });

  describe("URL Validation", () => {
    test("should validate a correct URL", () => {
      const validator = new EnsureString().url();
      expect(validator.validate("https://example.com")).toEqual({
        success: true,
        data: "https://example.com",
      });

      expect(validator.validate("http://example.com")).toEqual({
        success: true,
        data: "http://example.com",
      });
    });

    test("should fail for an invalid URL", () => {
      const validator = new EnsureString().url();
      expect(validator.validate("invalid-url")).toEqual({
        success: false,
        error: "Invalid URL",
      });

      expect(validator.validate("www.example.com")).toEqual({
        success: false,
        error: "Invalid URL",
      });

      expect(validator.validate("ftp://example.com")).toEqual({
        success: true,
        data: "ftp://example.com",
      });
    });
  });

  describe("Alphanumeric Validation", () => {
    test("should validate an alphanumeric string", () => {
      const validator = new EnsureString().alphaNumeric();
      expect(validator.validate("hello123")).toEqual({
        success: true,
        data: "hello123",
      });

      expect(validator.validate("test123")).toEqual({
        success: true,
        data: "test123",
      });
    });

    test("should fail for a non-alphanumeric string", () => {
      const validator = new EnsureString().alphaNumeric();
      expect(validator.validate("hello 123")).toEqual({
        success: false,
        error: "String must be alphanumeric",
      });

      expect(validator.validate("hello@123")).toEqual({
        success: false,
        error: "String must be alphanumeric",
      });

      expect(validator.validate("123-abc")).toEqual({
        success: false,
        error: "String must be alphanumeric",
      });
    });
  });

  describe("Combined Validations", () => {
    test("should validate a string with min and max length", () => {
      const validator = new EnsureString().min(3).max(10);
      expect(validator.validate("hello")).toEqual({
        success: true,
        data: "hello",
      });
    });

    test("should fail if string does not meet both min and max", () => {
      const validator = new EnsureString().min(3).max(5);
      expect(validator.validate("hi")).toEqual({
        success: false,
        error: "String must be at least 3 characters long",
      });

      expect(validator.validate("hello world")).toEqual({
        success: false,
        error: "String must be at most 5 characters long",
      });
    });

    test("should validate a valid email with length restrictions", () => {
      const validator = new EnsureString().email().min(10).max(30);
      expect(validator.validate("test@example.com")).toEqual({
        success: true,
        data: "test@example.com",
      });
    });

    test("should fail for an invalid email that doesn't meet length restrictions", () => {
      const validator = new EnsureString().email().min(20).max(30);
      expect(validator.validate("test@example.com")).toEqual({
        success: false,
        error: "String must be at least 20 characters long",
      });
    });
  });
});
