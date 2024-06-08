import { Type } from "../type.js";
import { CompositeValue } from "./composite-value.js";
import { isNumber } from "./number.js";
import { Value } from "./value.js";

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
