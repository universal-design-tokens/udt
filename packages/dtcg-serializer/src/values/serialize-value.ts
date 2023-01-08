import { Reference, Type, TokenValue, isReference, DimensionValue, ColorValue, ShadowValue } from "@udt/tom";
import { serializeReference } from "./reference";
import { serializeColor } from "./color";
import { serializeDimension } from "./dimension";
import { serializeShadow } from "./shadow";

export function serializeValue(value: TokenValue | Reference, type: Type): any {
  if (isReference(value)) {
    return serializeReference(value);
  }

  switch(type) {
    case Type.COLOR: {
      return serializeColor(value as ColorValue);
    }

    case Type.DIMENSION: {
      return serializeDimension(value as DimensionValue);
    }

    case Type.SHADOW: {
      return serializeShadow(value as ShadowValue);
    }

    case Type.NUMBER: {
      return value;
    }
  }

  throw new Error(`Unknown type: ${type}`);
}
