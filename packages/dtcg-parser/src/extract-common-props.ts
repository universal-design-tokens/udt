import { Extension, isValidType, TOMNodeCommonProps } from "@udt/tom";

export interface ExtractedCommonProps {
  commonProps: TOMNodeCommonProps;
  extensions: any;
  rest: any;
}

export function extractCommonProps(dtcgData: any): ExtractedCommonProps {
  const { $description, $type, $extensions, ...rest } = dtcgData;

  return {
    commonProps: {
      description: typeof $description === "string" ? $description : undefined,
      type: isValidType($type) ? $type : undefined,
    },
    extensions: $extensions,
    rest,
  };
}
