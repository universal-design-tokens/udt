import {
  JsonObject,
  isArray,
  isBoolean,
  isNull,
  isNumber,
  isObject,
  isString,
} from "@udt/tom";

export function parseArray(value: unknown): unknown[] {
  if (isArray(value)) {
    return value;
  }
  throw new Error(`${value} is not a valid array value`);
}

export function parseBoolean(value: unknown): boolean {
  if (isBoolean(value)) {
    return value;
  }
  throw new Error(`${value} is not a valid boolean value`);
}

export function parseNull(value: unknown): null {
  if (isNull(value)) {
    return value;
  }
  throw new Error(`${value} is not a valid null value`);
}

export function parseNumber(value: unknown): number {
  if (isNumber(value)) {
    return value;
  }
  throw new Error(`${value} is not a valid number value`);
}

export function parseString(value: unknown): string {
  if (isString(value)) {
    return value;
  }
  throw new Error(`${value} is not a valid string value`);
}

export function parseObject(value: unknown): JsonObject {
  if (isObject(value)) {
    return value;
  }
  throw new Error(`${value} is not a valid object value`);
}
