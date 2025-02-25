import { EnsureType } from "../core/EnsureType";
import { ValidationResult } from "../core/types";

export class EnsureString extends EnsureType<string> {
  private minLength?: number;
  private maxLength?: number;
  private isEmail?: boolean;
  private isURL?: boolean;
  private isAlphaNumeric?: boolean;

  min(length: number) {
    this.minLength = length;
    return this;
  }

  max(length: number) {
    this.maxLength = length;
    return this;
  }

  email() {
    this.isEmail = true;
    return this;
  }

  url() {
    this.isURL = true;
    return this;
  }

  alphaNumeric() {
    this.isAlphaNumeric = true;
    return this;
  }

  private checkMinLength(value: string) {
    return this?.minLength === undefined || value?.length >= this?.minLength;
  }

  private checkMaxLength(value: string) {
    return this?.maxLength === undefined || value?.length <= this?.maxLength;
  }

  private isEmailValid(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private isURLValid(value: string) {
    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value);
  }

  private isAlphaNumericValid(value: string) {
    return /^[a-zA-Z0-9]*$/.test(value);
  }

  validate(value: unknown): ValidationResult<string> {
    if (typeof value !== "string") {
      return { success: false, error: "Expected a string" };
    }
    if (!this.checkMinLength(value)) {
      console.log(" this.checkMinLength(value):", this.checkMinLength(value));
      return {
        success: false,
        error: `String must be at least ${this.minLength} characters long`,
      };
    }
    if (!this.checkMaxLength(value)) {
      return {
        success: false,
        error: `String must be at most ${this.maxLength} characters long`,
      };
    }
    if (this.isEmail && !this.isEmailValid(value)) {
      return { success: false, error: "Invalid email address" };
    }
    if (this.isURL && !this.isURLValid(value)) {
      return { success: false, error: "Invalid URL" };
    }
    if (this.isAlphaNumeric && !this.isAlphaNumericValid(value)) {
      return {
        success: false,
        error: "String must be alphanumeric",
      };
    }
    return { success: true, data: value };
  }
}
