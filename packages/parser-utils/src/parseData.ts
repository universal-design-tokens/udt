import { isJsonObject, type JsonObject } from "./isJsonObject.js";
import { extractProperties } from "./extractProperties.js";

export type IsDesignTokenDataFn = (data: JsonObject) => boolean;

export type ParseDesignTokenDataFn<ParsedDesignToken, T> = (
  data: JsonObject,
  path: string[],
  contextFromParent?: T
) => ParsedDesignToken;

export type AddChildFn<ParsedGroup, ParsedDesignToken> = (
  name: string,
  child: ParsedGroup | ParsedDesignToken
) => void;

export interface ParseGroupResult<ParsedGroup, ParsedDesignToken, T> {
  group: ParsedGroup;
  addChild?: AddChildFn<ParsedGroup, ParsedDesignToken>;
  contextForChildren?: T;
}

export type ParseGroupDataFn<ParsedGroup, ParsedDesignToken, T> = (
  data: JsonObject,
  path: string[],
  contextFromParent?: T
) => ParseGroupResult<ParsedGroup, ParsedDesignToken, T>;

export interface ParserConfig<ParsedDesignToken, ParsedGroup, T> {
  isDesignTokenData: IsDesignTokenDataFn;
  groupPropsToExtract: (string | RegExp)[];
  parseGroupData: ParseGroupDataFn<ParsedGroup, ParsedDesignToken, T>;
  parseDesignTokenData: ParseDesignTokenDataFn<ParsedDesignToken, T>;
}

export class InvalidDataError extends Error {
  public path: string[];
  public data: unknown;

  constructor(path: string[], data: unknown) {
    super(
      `Expected object at path "${path.join(
        "."
      )}", but got ${typeof data} instead`
    );
    this.name = "InvalidDataError";
    this.path = path;
    this.data = data;
  }
}

function parseDataImpl<ParsedDesignToken, ParsedGroup, T>(
  data: unknown,
  config: ParserConfig<ParsedDesignToken, ParsedGroup, T>,
  contextFromParent?: T,
  path: string[] = [],
  addToParent?: AddChildFn<ParsedGroup, ParsedDesignToken>
): ParsedDesignToken | ParsedGroup {
  if (!isJsonObject(data)) {
    throw new InvalidDataError(path, data);
  }

  const {
    isDesignTokenData,
    groupPropsToExtract,
    parseGroupData,
    parseDesignTokenData,
  } = config;

  let groupOrToken: ParsedGroup | ParsedDesignToken;
  if (isDesignTokenData(data)) {
    // looks like a token
    groupOrToken = parseDesignTokenData(data, path, contextFromParent);
    if (addToParent && path.length > 0) {
      addToParent(path[path.length - 1], groupOrToken);
    }
  } else {
    // must be a group
    const { extracted: groupData, remainingProps: childNames } =
      extractProperties(data, groupPropsToExtract);
    const { group, addChild, contextForChildren } = parseGroupData(
      groupData,
      path,
      contextFromParent
    );

    groupOrToken = group;

    if (addToParent && path.length > 0) {
      addToParent(path[path.length - 1], groupOrToken);
    }

    for (const childName of childNames) {
      parseDataImpl(
        data[childName],
        config,
        contextForChildren,
        [...path, childName],
        addChild
      );
    }
  }

  return groupOrToken;
}

export function parseData<ParsedDesignToken, ParsedGroup, T>(
  data: unknown,
  config: ParserConfig<ParsedDesignToken, ParsedGroup, T>,
  contextFromParent?: T
): ParsedDesignToken | ParsedGroup {
  return parseDataImpl(data, config, contextFromParent);
}
