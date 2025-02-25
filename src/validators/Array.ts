import { EnsureType } from "../core/EnsureType";
import { ValidationResult } from "../core/types";

export class EnsureArray<T> extends EnsureType<T[]> {
  private field: EnsureType<T>;
  constructor(field: EnsureType<T>) {
    super();
    this.field = field;
  }
  validate(value: unknown): ValidationResult<T[]> {
    if (!Array.isArray(value)) {
      return { success: false, error: "Expected an array" };
    }
    const result = [];
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const itemResult = this.field.validate(item);
      if (!itemResult.success) {
        return {
          success: false,
          error: `Item ${i}: ${itemResult.error}`,
        };
      }
      result.push(itemResult.data);
    }
    return { success: true, data: result };
  }
}
