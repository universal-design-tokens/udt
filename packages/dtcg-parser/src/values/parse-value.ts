import { isJsonValue, Type, Value, Reference } from "@udt/tom";
import { isReferenceValue, makeReference } from "./reference";
import { parseColorValue } from "./color";
import { parseDimensionValue } from "./dimension";
import { parseShadowValue } from "./shadow";
import {
  parseArray,
  parseBoolean,
  parseNull,
  parseNumber,
  parseObject,
  parseString,
} from "./json";

export function parseValue(value: unknown, type?: Type): Value | Reference {
  if (isReferenceValue(value)) {
    return makeReference(value);
  } else if (type === undefined && isJsonValue(value)) {
    return value;
  } else {
    switch (type) {
      case Type.COLOR: {
        return parseColorValue(value);
      }

      case Type.DIMENSION: {
        return parseDimensionValue(value);
      }

      case Type.SHADOW: {
        return parseShadowValue(value);
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
