import { Type } from "../type";

export abstract class Value {
  public abstract readonly type: Type;
}

export function isValue(value: unknown): value is Value {
  return value instanceof Value;
}
