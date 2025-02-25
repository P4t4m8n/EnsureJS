import { EnsureType } from "./core/EnsureType";
import { EnsureArray } from "./validators/Array";
import { EnsureDouble } from "./validators/Double";
import { EnsureInteger } from "./validators/Integer";
import { EnsureObject } from "./validators/Object";
import { EnsureString } from "./validators/String";

export const Ensure = {
  string: () => new EnsureString(),
  object: <T>(schema: Record<keyof T, EnsureType<unknown>>) =>
    new EnsureObject(schema),
  integer: () => new EnsureInteger(),
  double: () => new EnsureDouble(),
  array: <T>(field: EnsureType<T>) => new EnsureArray(field),
};
