import { Group, RootGroup } from "@udt/tom";
import { type PlainObject, type ParseGroupResult } from "@udt/parser-utils";
import { extractCommonProps } from "./extract-common-props.js";

export function parseGroup(
  groupProps: PlainObject,
  path: string[]
): ParseGroupResult<Group | RootGroup, never> {
  const { commonProps, rest } = extractCommonProps(groupProps);

  if (Object.keys(rest).length > 0) {
    throw new Error(`Invalid props: ${Object.keys(rest).join(", ")}`);
  }

  let group: Group | RootGroup;
  if (path.length === 0) {
    group = new RootGroup(commonProps);
  } else {
    const name = path[path.length - 1];
    group = new Group(name, commonProps);
  }

  return {
    group,
  };
}
