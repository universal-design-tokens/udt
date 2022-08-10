import { Reference, Type, Value, isReference, DimensionValue, ColorValue, ShadowValue } from "@udt/tom";
import { serializeReference } from "./reference";
import { serializeColor } from "./color";
import { serializeDimension } from "./dimension";
import { serializeShadow } from "./shadow";

export function serializeValue(value: Value | Reference, type: Type): any {
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

    // JSON types
    case Type.ARRAY:
    case Type.BOOLEAN:
    case Type.OBJECT:
    case Type.NULL:
    case Type.NUMBER:
    case Type.STRING: {
      return value;
    }
  }

  throw new Error(`Unknown type: ${type}`);
}
