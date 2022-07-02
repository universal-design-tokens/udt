export type ColorValue = string;

const rbgHexRegex = /^#([a-fA-F\d]{6})$/;

export function isColor(value: any): value is ColorValue {
  return typeof value === 'string' && rbgHexRegex.test(value);
}
