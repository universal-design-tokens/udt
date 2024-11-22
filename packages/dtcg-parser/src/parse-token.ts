import {
  type DeferredValue,
  DesignToken,
  type Reference,
  type Type,
} from "@udt/tom";
import { extractCommonProps } from "./extract-common-props.js";
import { parseValue } from "./values/parse-value.js";
import { isReferenceValue, makeReference } from "./values/reference.js";
import { type PlainObject } from "@udt/parser-utils";

export function parseToken(
  tokenProps: PlainObject,
  path: string[]
): DesignToken {
  const name = path[path.length - 1];
  const {
    commonProps,
    rest: { $value: value, ...rest },
  } = extractCommonProps(tokenProps);

  if (Object.keys(rest).length > 0) {
    throw new Error(`Invalid props: ${Object.keys(rest).join(", ")}`);
  }

  let tokenValue: DeferredValue | Reference;
  if (isReferenceValue(value)) {
    tokenValue = makeReference(value);
  } else {
    tokenValue = (ownOrInheritedType: Type) =>
      parseValue(value, ownOrInheritedType);
  }

  const token = new DesignToken(name, () => tokenValue, commonProps);

  return token;
}
