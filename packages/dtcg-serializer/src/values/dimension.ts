import { DimensionUnit, DimensionValue } from "@udt/tom";

export type DtcgDimensionValue = `${number}${DimensionUnit}`;

export function serializeDimension(dimension: DimensionValue): DtcgDimensionValue {
  return `${dimension.getAmount()}${dimension.getUnit()}`;
}
