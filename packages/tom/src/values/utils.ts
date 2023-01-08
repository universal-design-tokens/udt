import { Type } from "../type";
import { CompositeValue } from "./composite-value";
import { isNumber } from "./number";
import { Value } from "./value";

export const UNSUPPORTED_TYPE = -1;

export function identifyType(value: unknown): Type | typeof UNSUPPORTED_TYPE {
  if (value instanceof Value || value instanceof CompositeValue) {
    return value.type;
  }
  // Check if it's one of the primitive types
  if (isNumber(value)) {
    return Type.NUMBER;
  }

  return UNSUPPORTED_TYPE;
}
