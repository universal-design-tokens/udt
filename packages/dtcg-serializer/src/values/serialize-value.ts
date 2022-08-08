import { Reference, Type, Value, isReference, DimensionValue, ColorValue } from "@udt/tom";
import { serializeColor } from "./color";
import { serializeDimension } from "./dimension";

export function serializeValue(value: Value | Reference, type: Type): any {
  if (isReference(value)) {
    return `{${value.path.join('.')}}`;
  }

  switch(type) {
    case Type.COLOR: {
      return serializeColor(value as ColorValue);
    }

    case Type.DIMENSION: {
      return serializeDimension(value as DimensionValue);
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
