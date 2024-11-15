import { type JsonObject } from "./isJsonObject.js";

export function extractProperties(
  object: JsonObject,
  propsToExtract: (string | RegExp)[]
): {
  extracted: JsonObject;
  remainingProps: string[];
} {
  const propNamesToExtract = propsToExtract.filter(
    (prop) => typeof prop === "string"
  );
  const propRegexesToExtract = propsToExtract.filter(
    (prop) => prop instanceof RegExp
  );

  const extracted: JsonObject = {};
  const remainingProps: string[] = [];
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
      remainingProps.push(prop);
    }
  });

  return {
    extracted,
    remainingProps,
  };
}
