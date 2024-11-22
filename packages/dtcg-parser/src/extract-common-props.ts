import { isValidType, type TOMNodeCommonConstructorProps } from "@udt/tom";
import { isPlainObject } from "@udt/parser-utils";

export interface ExtractedCommonProps {
  commonProps: TOMNodeCommonConstructorProps;
  rest: any;
}

export function extractCommonProps(dtcgData: any): ExtractedCommonProps {
  const { $description, $type, $extensions, ...rest } = dtcgData;

  return {
    commonProps: {
      description: typeof $description === "string" ? $description : undefined,
      type: isValidType($type) ? $type : undefined,
      extensions: isPlainObject($extensions) ? $extensions : undefined,
    },
    rest,
  };
}
