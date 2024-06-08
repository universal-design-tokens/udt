import { Type, TokenValue } from "@udt/tom";
import { parseColorValue } from "./color.js";
import { parseDimensionValue } from "./dimension.js";
import { parseShadowValue } from "./shadow.js";
import { parseNumber } from "./number.js";

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
