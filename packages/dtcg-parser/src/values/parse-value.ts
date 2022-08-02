import { isJsonValue, Type, Value, Reference } from "@udt/tom";
import { parseDimensionValue } from "./dimension";
import {
  parseArray,
  parseBoolean,
  parseNull,
  parseNumber,
  parseObject,
  parseString,
} from "./json";

const referenceRegex = /^\{[^\.\{\}]+(\.[^\.\{\}]+)*\}$/;

export function isReferenceValue(value: any): value is string {
  return typeof value === 'string' && referenceRegex.test(value);
}

export function referenceToPath(referenceValue: string): string[] {
  if (!isReferenceValue(referenceValue)) {
    throw new Error(`"${referenceValue}" is not a valid reference`);
  }
  return referenceValue.slice(1, -1).split('.');
}

export function parseValue(value: unknown, type?: Type): Value | Reference {
  if (isReferenceValue(value)) {
    return new Reference(referenceToPath(value));
  }
  else if (type === undefined && isJsonValue(value)) {
    return value;
  } else {
    switch (type) {
      case Type.DIMENSION: {
        return parseDimensionValue(value);
      }

      case Type.ARRAY: {
        return parseArray(value);
      }

      case Type.BOOLEAN: {
        return parseBoolean(value);
      }

      case Type.OBJECT: {
        return parseObject(value);
      }

      case Type.NULL: {
        return parseNull(value);
      }

      case Type.NUMBER: {
        return parseNumber(value);
      }

      case Type.STRING: {
        return parseString(value);
      }
    }
  }

  throw new Error(`Unknown type: ${type}`);
}
