import { Type } from "../type";

export type JsonObject = Record<string, unknown>;

export type JsonValue =
  | unknown[]
  | boolean
  | JsonObject
  | null
  | number
  | string;

export const UNSUPPORTED_TYPE = -1;

export function identifyJsonType(
  value: unknown
):
  | Type.ARRAY
  | Type.BOOLEAN
  | Type.NULL
  | Type.NUMBER
  | Type.OBJECT
  | Type.STRING
  | typeof UNSUPPORTED_TYPE {
  switch (typeof value) {
    case "boolean":
      return Type.BOOLEAN;

    case "number":
      return Type.NUMBER;

    case "string":
      return Type.STRING;

    case "object": {
      if (value === null) {
        return Type.NULL;
      }
      if (Array.isArray(value)) {
        return Type.ARRAY;
      }

      return Type.OBJECT;
    }
  }
  return UNSUPPORTED_TYPE;
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isNull(value: unknown): value is null {
  return typeof value === null;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !isArray(value);
}

export function isJsonValue(value: unknown): value is JsonValue {
  return (
    isBoolean(value) ||
    isNumber(value) ||
    isString(value) ||
    isNull(value) ||
    isArray(value) ||
    isObject(value)
  );
}
