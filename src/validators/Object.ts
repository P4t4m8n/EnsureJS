import { EnsureType } from "../core/EnsureType";
import { ValidationResult } from "../core/types";

export class EnsureObject<T> extends EnsureType<T> {
  private schema: Record<keyof T, EnsureType<any>>;

  constructor(schema: Record<keyof T, EnsureType<unknown>>) {
    super();
    this.schema = schema;
  }

  validate(value: any): ValidationResult<T> {
    if (typeof value !== "object" || value === null) {
      return { success: false, error: "Expected an object" };
    }
    const result: any = {};
    for (const key in this.schema) {
      const field = this.schema[key];
      const fieldValue = value[key];
      const fieldResult = field.validate(fieldValue);
      if (!fieldResult.success) {
        return {
          success: false,
          error: `Field "${key}": ${fieldResult.error}`,
        };
      }
      result[key] = fieldResult.data;
    }
    return { success: true, data: result };
  }
}
