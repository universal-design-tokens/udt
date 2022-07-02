export type DimensionValue = `${number}${'px' | 'rem'}`;

const dimensionRegex = /^[0-9]+(\.[0-9]+)?(px|rem)$/;

export function isDimension(value: any): value is DimensionValue {
  return typeof value === 'string' && dimensionRegex.test(value);
}
