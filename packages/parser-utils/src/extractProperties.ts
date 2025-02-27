import { type PlainObject } from "./isJsonObject.js";

/**
 * Extracts specfied properties and their values from
 * an object.
 *
 * A bit like destructuring, except that you can also use
 * regular expressions to match the properties you want to
 * extract.
 *
 * @param object  The plain object from which to extract
 *                properties.
 * @param propsToExtract An array of names, and/or
 *                regular expressions that match the
 *                names of the properties to exract.
 * @returns The object containing the extracted properties
 *          and their values, and an array of all property
 *          names of the input object that were not extracted.
 */
export function extractProperties(
  object: PlainObject,
  propsToExtract: readonly (string | RegExp)[]
): {
  /**
   * Object containg the extract properties
   * and their respective values.
   */
  extracted: PlainObject;

  /**
   * Object containing the remaining, unextracted
   * properties and their respective values.
   */
  rest: PlainObject;
} {
  const propNamesToExtract = propsToExtract.filter(
    (prop) => typeof prop === "string"
  );
  const propRegexesToExtract = propsToExtract.filter(
    (prop) => prop instanceof RegExp
  );

  const extracted: PlainObject = {};
  const rest: PlainObject = {};
  Object.getOwnPropertyNames(object).forEach((prop) => {
    if (
      propNamesToExtract.some(
        (propNameToExtract) => propNameToExtract === prop
      ) ||
      propRegexesToExtract.some((propRegexToExtract) =>
        propRegexToExtract.test(prop)
      )
    ) {
      extracted[prop] = object[prop];
    } else {
      rest[prop] = object[prop];
    }
  });

  return {
    extracted,
    rest,
  };
}
