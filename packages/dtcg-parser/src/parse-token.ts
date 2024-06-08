import { DeferredValue, DesignToken, Reference, Type } from "@udt/tom";
import { extractCommonProps } from "./extract-common-props.js";
import { parseValue } from "./values/parse-value.js";
import { isReferenceValue, makeReference } from "./values/reference.js";

export function parseToken(name: string, dtcgData: unknown): DesignToken {
  const {
    commonProps,
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

  return token;
}
