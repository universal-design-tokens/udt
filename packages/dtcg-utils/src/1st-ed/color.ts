/*
 * Utilities and types for working with DTCG color values, as
 * specified since the 1st Editor's Draft of the DTCG format
 * specification.
 */

/**
 * Color value, as specified in 1st & 2nd Editors' Drafts.
 *
 * Note, the syntax of color values changed in
 * non-backwards-compatible way in the 3rd Editor's Draft.
 *
 * @see https://www.designtokens.org/tr/first-editors-draft/format/#color
 * @see https://www.designtokens.org/tr/second-editors-draft/format/#color
 */
// TypeScript doesn't have a good way of representing color hex
// codes as a string, but this at least enforces the hash character
// at the start. Inspired by:
// https://medium.com/@steve.alves2/how-to-type-hex-colors-in-typescript-3c3b9a32baa7
export type ColorValue1stED = `#${string}`;

// Used by `isValidColorValue1stED()`:
const colorValueRegex = /^#([\da-fA-F]{2}){3,4}$/;

/**
 * Checks if the value is a valid color value, as specified
 * in the 1st & 2nd Editors' Drafts.
 *
 * This is a strict check that follows the spec exactly. Whitespace,
 * or non-lowercase unit names will therefore be rejected.
 *
 * - `#abc123`: Valid
 * - `#FF00BBaa`: Valid
 * - `FFFFFF`: Invalid (missing # prefix)
 * - ` #abc123 `: Invalid (contains whitespace)
 * - `#xyz123`: Invalid (invalid hex digits)
 *
 * Note, the syntax of color values changed in
 * non-backwards-compatible way in the 3rd Editor's Draft.
 *
 * @see https://www.designtokens.org/tr/first-editors-draft/format/#color
 * @see https://www.designtokens.org/tr/second-editors-draft/format/#color
 *
 * @param value The value to be checked
 *
 * @returns `true` if `value` is a valid DTCG color value, `false` otherwise.
 */
export function isValidColorValue1stED(
  value: unknown
): value is ColorValue1stED {
  return typeof value === "string" && colorValueRegex.test(value);
}
