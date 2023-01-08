import {
  isNumber,
} from "@udt/tom";

export function parseNumber(value: unknown): number {
  if (isNumber(value)) {
    return value;
  }
  throw new Error(`${value} is not a valid number value`);
}
