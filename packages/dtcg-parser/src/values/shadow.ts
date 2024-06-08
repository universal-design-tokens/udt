import { ShadowValue } from "@udt/tom";
import { parseColorValue } from "./color.js";
import { parseDimensionValue } from "./dimension.js";
import { isReferenceValue, makeReference } from "./reference.js";

export function parseShadowValue(value: any): ShadowValue {
  if (typeof value === "object") {
    const { color, offsetX, offsetY, blur, spread, ...rest } = value;

    if (Object.keys(rest).length > 0) {
      throw new Error(
        `Invalid props in shadow value: ${Object.keys(rest).join(", ")}`
      );
    }

    return new ShadowValue({
      color: isReferenceValue(color)
        ? makeReference(color)
        : parseColorValue(color),

      offsetX: isReferenceValue(offsetX)
        ? makeReference(offsetX)
        : parseDimensionValue(offsetX),

      offsetY: isReferenceValue(offsetY)
        ? makeReference(offsetY)
        : parseDimensionValue(offsetY),

      blur: isReferenceValue(blur)
        ? makeReference(blur)
        : parseDimensionValue(blur),

      spread: isReferenceValue(spread)
        ? makeReference(spread)
        : parseDimensionValue(spread),
    });
  }

  throw new Error(`${value} is not a valid DTCG shadow value`);
}
