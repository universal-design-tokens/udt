import { Type, TokenValue, Reference } from "@udt/tom";
import { isReferenceValue, makeReference } from "./reference";
import { parseColorValue } from "./color";
import { parseDimensionValue } from "./dimension";
import { parseShadowValue } from "./shadow";
import { parseNumber } from "./number";

export function parseValue(value: unknown, type: Type): TokenValue {
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

    case Type.NUMBER: {
      return parseNumber(value);
    }
  }

  throw new Error(`Unknown type: ${type}`);
}
