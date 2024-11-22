/**
 * A plain object.
 *
 * I.e. `{ ... }`, and not an array or `null`, which
 * JavaScript's `typeof` operator would also return
 * `"object"` for.
 */
export type PlainObject = Record<string, unknown>;

/**
 * Checks whether a value is a plain object.
 *
 * @param value The value to check.
 *
 * @returns `true` if it is a plain object, `false` otherwise.
 */
export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
