import { ColorValue, isColor } from "./color";
import { DimensionValue, isDimension } from "./dimension";
import { Referencable, makeReferencableValueValidator } from "./type-utils";


export interface ShadowValue {
  color: Referencable<ColorValue>;
  offsetX: Referencable<DimensionValue>;
  offsetY: Referencable<DimensionValue>;
  blur: Referencable<DimensionValue>;
  spread: Referencable<DimensionValue>;
}

const isColorOrReference = makeReferencableValueValidator(isColor);
const isDimensionOrReference = makeReferencableValueValidator(isDimension);

export function isShadow(value: any): value is ShadowValue {
  if(value === undefined || value === null) {
    return false;
  }

  const { color, offsetX, offsetY, blur, spread, ...rest } = value;
  if (Object.keys(rest).length > 0) {
    // No additional properties allowed
    return false;
  }

  return (
    isColorOrReference(color) &&
    isDimensionOrReference(offsetX) &&
    isDimensionOrReference(offsetY) &&
    isDimensionOrReference(blur) &&
    isDimensionOrReference(spread)
  );
}
