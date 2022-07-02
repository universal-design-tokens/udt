import { isReferenceValue } from "../reference";

export type Referencable<T> = T | string;

export type ValueValidator<T> = (value: any) => value is T;

export function makeReferencableValueValidator<T>(
  isValidValue: ValueValidator<T>
): ValueValidator<T | string> {
  return function (value: any): value is T | string {
    return isValidValue(value) || isReferenceValue(value);
  };
}
