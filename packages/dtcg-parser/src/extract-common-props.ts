import { isValidType, TOMNodeCommonProps } from "@udt/tom";

export interface ExtractedCommonProps {
  commonProps: TOMNodeCommonProps;
  rest: any;
}

export function extractCommonProps(dtcgData: any): ExtractedCommonProps {
  const { $description, $type, ...rest } = dtcgData;

  return {
    commonProps: {
      description: typeof $description === "string" ? $description : undefined,
      type: isValidType($type) ? $type : undefined,
    },
    rest,
  };
}
