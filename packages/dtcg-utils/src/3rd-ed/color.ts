/**
 * Utilities and types for working with DTCG color values, as first specified
 * in the 3rd Editor's Draft of the DTCG format specification.
 */

import { isPlainObject } from "@udt/parser-utils";

/**
 * All support color space keys, as specified since the 3rd Editor's
 * Draft.
 *
 * @see https://www.designtokens.org/tr/third-editors-draft/color/#supported-color-spaces
 */
export const colorSpaces3rdED = [
  "srgb",
  "srgb-linear",
  "hsl",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "display-p3",
  "a98-rgb",
  "prophoto-rgb",
  "rec2020",
  "xyz-d65",
  "xyz-d50",
] as const;

/**
 * Supported color space key, as specified since the 3rd Editor's
 * Draft.
 *
 * @see https://www.designtokens.org/tr/third-editors-draft/color/#supported-color-spaces
 */
export type ColorSpace3rdED = (typeof colorSpaces3rdED)[number];

/**
 * Checks if the given color space key is valid, as specified since
 * the 3rd Editor's Draft.
 *
 * @param colorSpaceKey
 * @returns
 */
export function isValidColorSpace3rdED(
  colorSpaceKey: unknown
): colorSpaceKey is ColorSpace3rdED {
  return (colorSpaces3rdED as ReadonlyArray<unknown>).includes(colorSpaceKey);
}

export type ColorComponents3rdED = [
  number | "none",
  number | "none",
  number | "none"
];

export function isValidColorComponents(
  components: unknown
): components is ColorComponents3rdED {
  return (
    Array.isArray(components) &&
    components.length === 3 &&
    components.every(
      (component) => typeof component === "number" || component === "none"
    )
  );
}

/**
 * Color value, as specified since the 3rd Editor's Draft.
 */
export type ColorValue3rdED = {
  /**
   * A string that specifies the color space or color model.
   */
  colorSpace: ColorSpace3rdED;

  /**
   * An array representing the color components. The number of components depends on the color space.
   */
  components: ColorComponents3rdED;

  /**
   * A number that represents the alpha value of the color. This value is between 0 and 1, where 0 is fully transparent and 1 is fully opaque. If omitted, the alpha value of the color MUST be assumed to be 1 (fully opaque).
   */
  alpha?: number;

  /**
   * A string that represents a fallback value of the color. The fallback color MUST be formatted in 6 digit CSS hex color notation format to avoid conflicts with the provided alpha value.
   */
  hex?: `#${string}`;
};

const hexTripletRegex = /^#[\da-zA-Z]{6}$/;

/**
 * Checks if the value is a valid color value, as specified
 * since the 3rd Third Editors' Draft.
 *
 * This is a strict check that follows the spec exactly.
 *
 * - `.colorSpace` and `.components` must be present
 * - `.colorSpace` must be a supported color space key
 * - `.components` must be an array of numbers or "none" strings
 * - `.alpha`, if present, must be a number
 * - `.hex`, if present, must be a hex triplet
 * - no other properties may be present
 *
 * @param value The value to be checked
 *
 * @returns `true` if `value` is a valid DTCG dimension value, `false` otherwise.
 */
export function isValidColorValue3rdED(
  value: unknown
): value is ColorValue3rdED {
  if (!isPlainObject(value)) {
    return false;
  }

  const { colorSpace, components, alpha, hex, ...rest } = value;

  if (Object.keys(rest).length > 0) {
    // contains non-standard properties
    return false;
  }

  return (
    // MUST have a valid .colorSpace
    isValidColorSpace3rdED(value.colorSpace) &&
    // MUST have valid .components
    isValidColorComponents(value.components) &&
    // If .alpha exists, it MUST be a number
    (alpha === undefined || typeof alpha === "number") &&
    // If .hex exists, it MUST be a hex triplet
    (hex === undefined ||
      (typeof hex === "string" && hexTripletRegex.test(hex)))
  );
}
