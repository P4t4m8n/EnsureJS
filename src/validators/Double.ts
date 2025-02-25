import { ValidationResult } from "../core/types";
import { EnsureNumber } from "./Number";

export class EnsureDouble extends EnsureNumber {
  validate(value: unknown): ValidationResult<number> {
    const baseValidation = super.validate(value);

    if (!baseValidation.success) {
      return baseValidation;
    }

    if (!this.isNonInteger(baseValidation.data)) {
      return {
        success: false,
        error: "Expected a double (floating-point number)",
      };
    }

    return baseValidation;
  }
}
