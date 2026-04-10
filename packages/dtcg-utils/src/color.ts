/**
 * Utilities and types for working with DTCG color values, as
 * specified in the most recent, published spec version (currently
 2025.10).
 */

import { type Color1stED } from "./1st-ed/color.js";
import {
  type Color3rdED,
  type ColorComponents3rdED,
  type ColorSpace3rdED,
  colorSpaces3rdED,
  fromColor1stEDTo3rdEd,
  isValidColor3rdED,
  isValidColorComponents3rdED,
  isValidColorSpace3rdED,
  sanitizeColor3rdED,
  SanitizeColor3rdEDOptions,
} from "./3rd-ed/color.js";

/**
 * All support color space keys, as specified in the most
 * recent, published spec version.
 */
export const colorSpaces = colorSpaces3rdED;

/**
 * Supported color space key, as specified in the most
 * recent, published spec version.
 */
export type ColorSpace = ColorSpace3rdED;

/**
 * Checks if the given color space key is valid, as specified
 * in the most recent, published spec version.
 *
 * @param colorSpaceKey
 * @returns
 */
export const isValidColorSpace: (
  colorSpaceKey: unknown
) => colorSpaceKey is ColorSpace = isValidColorSpace3rdED;

export type ColorComponents = ColorComponents3rdED;

export const isValidColorComponents: (
  components: unknown
) => components is ColorComponents = isValidColorComponents3rdED;

/**
 * Color value, as specified in the most recent, published spec
 * version.
 */
export type Color = Color3rdED<ColorSpace, ColorComponents>;

/**
 * Checks if the value is a valid color value, as specified
 * in the most recent, published spec version.
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
export const isValidColor: (value: unknown) => value is Color =
  isValidColor3rdED;

/**
 * Converts a legacy color value that conforms to the syntax
 * of the 1st and 2nd Editor's Drafts to one that conforms to
 * the the most recent, published spec version.
 *
 * @param legacyColorVal A legacy color value (e.g. `"#aabbcc"`)
 * @returns The equivalent, current spec color value.
 */
export const fromColor1stED: (legacyColorVal: Color1stED) => Color =
  fromColor1stEDTo3rdEd;

export type SanitizeColorOptions = SanitizeColor3rdEDOptions;

/**
 * Attempts to sanitize the input value to a valid color value,
 * as specified in the most recent, published spec version.
 *
 * Tries to clean the input, to handle values that slightly
 * deviate from the spec.
 *
 * @throws {DtcgValueParseException} if the input could not be
 *                                    cleaned.
 *
 * @param input     The value to be sanitized.
 * @param options   Options for sanitizing the input. If omitted, only
 *                  spec-compliant values will be accepted.
 * @returns A spec-compliant color value.
 */
export const sanitizeColor: (
  input: unknown,
  options?: SanitizeColorOptions
) => Color = sanitizeColor3rdED;
