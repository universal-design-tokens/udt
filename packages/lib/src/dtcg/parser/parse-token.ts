import { DesignToken } from "../tom/design-token";
import { extractCommonProps } from "./extract-common-props";

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

  return new DesignToken(name, value, { ...commonProps, extensions });
}
