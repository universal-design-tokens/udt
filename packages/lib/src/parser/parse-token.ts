import { DesignToken } from "../tom/design-token";
import { extractCommonProps } from "./extract-common-props";
import { isJsonObject } from "./utils";

export function parseToken(name: string, dtcgData: any): DesignToken {
  const {
    commonProps,
    rest: {
      $value: value,
      $extensions: extensions,
      ...rest
    },
  } = extractCommonProps(dtcgData);


  if (Object.keys(rest).length > 0) {
    throw new Error(`Invalid props: ${Object.keys(rest).join(', ')}`);
  }

  const token = new DesignToken(name, value, commonProps);
  if (isJsonObject(extensions)) {
    for (const key of Object.keys(extensions)) {
      token.setExtension(key, extensions[key]);
    }
  }

  return token;
}
