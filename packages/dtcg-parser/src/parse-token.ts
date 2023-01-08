import { DeferredValue, DesignToken, Reference, Type } from "@udt/tom";
import { addExtensions } from "./add-extensions";
import { extractCommonProps } from "./extract-common-props";
import { isJsonObject } from "./utils";
import { parseValue } from "./values/parse-value";
import { isReferenceValue, makeReference } from "./values/reference";

export function parseToken(name: string, dtcgData: unknown): DesignToken {
  const {
    commonProps,
    extensions,
    rest: { $value: value, ...rest },
  } = extractCommonProps(dtcgData);

  if (Object.keys(rest).length > 0) {
    throw new Error(`Invalid props: ${Object.keys(rest).join(", ")}`);
  }

  let tokenValue: DeferredValue | Reference;
  if (isReferenceValue(value)) {
    tokenValue = makeReference(value);
  }
  else {
    tokenValue = (ownOrInheritedType: Type) => parseValue(value, ownOrInheritedType);
  }

  const token = new DesignToken(
    name,
    () => tokenValue,
    commonProps
  );

  addExtensions(token, extensions);

  return token;
}
