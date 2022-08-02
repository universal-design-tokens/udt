import { DesignToken, Type } from "@udt/tom";
import { extractCommonProps } from "./extract-common-props";
import { isJsonObject } from "./utils";
import { parseValue } from "./values/parse-value";

export function parseToken(name: string, dtcgData: unknown): DesignToken {
  const {
    commonProps,
    rest: { $value: value, $extensions: extensions, ...rest },
  } = extractCommonProps(dtcgData);

  if (Object.keys(rest).length > 0) {
    throw new Error(`Invalid props: ${Object.keys(rest).join(", ")}`);
  }

  const token = new DesignToken(
    name,
    (ownOrInheritedType?: Type) => parseValue(value, ownOrInheritedType),
    commonProps
  );
  if (isJsonObject(extensions)) {
    for (const key of Object.keys(extensions)) {
      token.setExtension(key, extensions[key]);
    }
  }

  return token;
}
