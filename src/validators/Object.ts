import { EnsureType } from "../core/EnsureType";
import { ValidationResult } from "../core/types";

export class EnsureObject<T> extends EnsureType<T> {
  private schema: Record<keyof T, EnsureType<any>>;

  constructor(schema: Record<keyof T, EnsureType<unknown>>) {
    super();
    this.schema = schema;
  }

  validate(value: any): ValidationResult<T> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return { success: false, error: "Expected an object" };
    }

    const result: any = {};
    const errors: string[] = [];

    // Validate fields in schema
    for (const key in this.schema) {
      const field = this.schema[key];
      const fieldValue = value[key];
      const fieldResult = field.validate(fieldValue);

      if (!fieldResult.success) {
        errors.push(`Field "${key}": ${fieldResult.error}`);
      } else {
        result[key] = fieldResult.data;
      }
    }

    // Handle unexpected fields
    for (const key in value) {
      if (!(key in this.schema)) {
        errors.push(`Field "${key}": Unexpected field not allowed`);
      }
    }

    return errors.length > 0
      ? { success: false, error: errors.join("\n") }
      : { success: true, data: result };
  }
}
