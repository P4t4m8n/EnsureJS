import { ValidationResult } from "./types";

export class EnsureType<T> {
  parse(value: unknown): T {
    const result = this.validate(value);
    if (result.success) {
      return result.data;
    }
    throw new Error(result.error);
  }

  validate(value: unknown): ValidationResult<T> {
    throw new Error("Not implemented");
  }
}
