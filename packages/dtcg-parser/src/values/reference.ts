import { Reference } from "@udt/tom";

const referenceRegex = /^\{[^\.\{\}]+(\.[^\.\{\}]+)*\}$/;

export function isReferenceValue(value: any): value is string {
  return typeof value === 'string' && referenceRegex.test(value);
}

export function makeReference(referenceValue: string): Reference {
  if (!isReferenceValue(referenceValue)) {
    throw new Error(`"${referenceValue}" is not a valid reference`);
  }
  return new Reference(referenceValue.slice(1, -1).split('.'));
}
