import { isReference, ShadowValue } from "@udt/tom";
import { DtcgColorValue, serializeColor } from "./color";
import { DtcgDimensionValue, serializeDimension } from "./dimension";
import { DtcgReference, serializeReference } from "./reference";

export interface DtcgShadowValue {
  color: DtcgColorValue | DtcgReference;
  offsetX: DtcgDimensionValue | DtcgReference;
  offsetY: DtcgDimensionValue | DtcgReference;
  blur: DtcgDimensionValue | DtcgReference;
  spread: DtcgDimensionValue | DtcgReference;
}

export function serializeShadow(shadow: ShadowValue): DtcgShadowValue {
  const color = shadow.getColor();
  const offsetX = shadow.getOffsetX();
  const offsetY = shadow.getOffsetY();
  const blur = shadow.getBlur();
  const spread = shadow.getSpread();

  return {
    color: isReference(color)
      ? serializeReference(color)
      : serializeColor(color),
    offsetX: isReference(offsetX)
      ? serializeReference(offsetX)
      : serializeDimension(offsetX),
    offsetY: isReference(offsetY)
      ? serializeReference(offsetY)
      : serializeDimension(offsetY),
    blur: isReference(blur)
      ? serializeReference(blur)
      : serializeDimension(blur),
    spread: isReference(spread)
      ? serializeReference(spread)
      : serializeDimension(spread),
  };
}
