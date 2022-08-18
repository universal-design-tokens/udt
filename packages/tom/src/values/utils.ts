import { Type } from "../type";
import { CompositeValue } from "./composite-value";
import { identifyJsonType, UNSUPPORTED_TYPE } from "./json";
import { Value } from "./value";

export function identifyType(value: unknown): Type | typeof UNSUPPORTED_TYPE {
  if (value instanceof Value || value instanceof CompositeValue) {
    return value.type;
  }
  return identifyJsonType(value);
}
