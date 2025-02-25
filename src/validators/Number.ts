import { EnsureType } from "../core/EnsureType";
import { ValidationResult } from "../core/types";
export class EnsureNumber extends EnsureType<number> {
  protected minValue?: number;
  protected maxValue?: number;

  min(value: number) {
    this.minValue = value;
    return this;
  }

  max(value: number) {
    this.maxValue = value;
    return this;
  }
  validate(value: unknown): ValidationResult<number> {
    if (typeof value !== "number") {
      return { success: false, error: "Expected an integer" };
    }
    if (this.minValue && value < this.minValue) {
      return {
        success: false,
        error: `Value must be at least ${this.minValue}`,
      };
    }
    if (this.maxValue && value > this.maxValue) {
      return {
        success: false,
        error: `Value must be at most ${this.maxValue}`,
      };
    }
    return { success: true, data: value };
  }
  /**
   * Checks if the given number is a real number. distinguishes between real numbers and integers.
   * 10.0 => true (real number)
   * 10 => false (integer)
   * @param value - The number to check.
   * @returns True if the number is a real number, false otherwise.
   */
  protected isNonInteger(value: number): boolean {
    const strNum = value.toString();
    return strNum.includes(".");
  }
}
