import { type PlainObject, parseData } from "@udt/parser-utils";
import { RootGroup } from "@udt/tom";
import { parseGroup } from "./parse-group.js";
import { parseToken } from "./parse-token.js";

/**
 * Checks if the given object looks like design token.
 *
 * @param data
 * @returns
 */
function isDesignTokenData(data: PlainObject): boolean {
  return data.$value !== undefined;
}

const dtcgPropRegex = /^\$/;

export function parseDtcgFileData(dtcgData: unknown): RootGroup {
  const result = parseData(dtcgData, {
    isDesignTokenData,
    groupPropsToExtract: [dtcgPropRegex],
    parseGroupData: parseGroup,
    parseDesignTokenData: parseToken,
    addChildToGroup(group, _name, child) {
      group.addChild(child);
    },
  });

  if (!(result instanceof RootGroup)) {
    throw new Error("Parser output was not a root group");
  }

  return result;
}
