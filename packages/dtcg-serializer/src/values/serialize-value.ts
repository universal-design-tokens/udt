import { Reference, Type, Value, isReference, DimensionValue } from "@udt/tom";
import { serializeDimension } from "./dimension";

export function serializeValue(value: Value | Reference, type: Type): any {
  if (isReference(value)) {
    return `{${value.path.join('.')}}`;
  }

  switch(type) {
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
