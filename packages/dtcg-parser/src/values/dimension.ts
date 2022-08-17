import { DimensionUnit, DimensionValue } from "@udt/tom";

const dimensionRegex = /^([0-9]+(\.[0-9]+)?)(px|rem)$/;

export function parseDimensionValue(value: unknown): DimensionValue {
  if (typeof value === 'string') {
    const matches = value.match(dimensionRegex);
    if (matches !== null) {
      const [_ignored, amount, _fraction, unit] = matches;
      return new DimensionValue({
        amount: parseFloat(amount),
        unit: (unit as DimensionUnit)
      });
    }
  }
  throw new Error(`${value} is not a valid DTCG dimension value`);
}
