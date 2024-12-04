import { isPlainObject, type PlainObject } from "./isJsonObject.js";
import { extractProperties } from "./extractProperties.js";

/**
 * A function that checks whether an object is a design token
 * or not (if not, it is assumed to be a group).
 *
 * E.g. for DTCG data, this could check for the presence of a
 * `$value` property.
 *
 * @param data A plain object (guaranteed not to `null` or an
 *             array)
 *
 * @returns `true` if `data` is design token data, `false` if
 *          it is group data.
 */
export type IsDesignTokenDataFn = (data: PlainObject) => boolean;

/**
 * A function that parses design token data.
 *
 * @param data  A plain object containing design token data
 *              (guaranteed not to be `null` or an array)
 * @param path  The path to the design token data.
 * @param contextFromParent Context data (if any) that was
 *              returned by the `parseGroupData()` call that
 *              parsed the group containing this design token.
 *
 * @returns The parsed representation of the design token.
 *          May be `undefined` if there is no useful result
 *          to return from `parseData()` - e.g. if just
 *          logging design token info or something like that.
 */
export type ParseDesignTokenDataFn<ParsedDesignToken, T> = (
  data: PlainObject,
  path: string[],
  contextFromParent?: T
) => ParsedDesignToken;

/**
 * A function that adds a parsed group or design token
 * as a child of the given parsed group.
 *
 * @param parent The parent group to add a child to
 * @param name  The name of the child group or design token
 * @param child The group or design token to add
 */
export type AddChildFn<ParsedGroup, ParsedDesignToken> = (
  parent: ParsedGroup,
  name: string,
  child: ParsedGroup | ParsedDesignToken
) => void;

/**
 * The return value of a `ParseGroupDataFn`.
 */
export interface ParseGroupResult<ParsedGroup, T> {
  /**
   * The parsed representation of the group.
   *
   * May be omitted if there is no useful result to
   * return and we only need to pass along context
   * data.
   */
  group?: ParsedGroup;

  /**
   * Optional context data to be passed into the
   * `parseGroupData()` and `parseDesignTokenData()` calls
   * for any nested group or design token data.
   *
   * Useful if those functions need access to some data from
   * higher up in the original data structure. For example, if
   * parsing DTCG data, this could be used to pass inherited
   * properties like `$type` down.
   */
  contextForChildren?: T;
}

/**
 * A function that parses group data.
 *
 * @param data  A plain object containing group data
 *              (guaranteed not to be `null` or an array)
 * @param path  The path to the group data.
 * @param contextFromParent Context data (if any) that was
 *              returned by the `parseGroupData()` call that
 *              parsed the group containing this group.
 *
 * @returns The parsed representation of the group and,
 *          optionally, some context data to pass down
 *          when child data is parsed.
 */
export type ParseGroupDataFn<ParsedGroup, T> = (
  data: PlainObject,
  path: string[],
  contextFromParent?: T
) => ParseGroupResult<ParsedGroup, T>;

export interface ParserConfig<ParsedDesignToken, ParsedGroup, T> {
  /**
   * A function that determines whether an object in the input
   * data is a design token or a group.
   */
  isDesignTokenData: IsDesignTokenDataFn;

  /**
   * Array of strings and/or RegExp which match
   * properties of group objects that are NOT
   * names of child design tokens or groups.
   *
   * E.g. for DTCG data, this could be a RegEx
   * like /^$/ which would match all $-prefixed
   * format properties
   */
  groupPropsToExtract: (string | RegExp)[];

  /**
   * Function which is called for each group data object
   * that is encountered.
   *
   * Is given the extracted properties of that group and its
   * path, and should parse that data into whatever structure
   * is desired.
   */
  parseGroupData?: ParseGroupDataFn<ParsedGroup, T>;

  /**
   * Function which is called for each design token
   *data object that is encountered.
   *
   * Is given the design token data and its path, and
   * should parse that data into whatever structure is
   * desired.
   */
  parseDesignTokenData: ParseDesignTokenDataFn<ParsedDesignToken, T>;

  /**
   * Optional function that will add parsed groups
   * or design tokens as children of another parsed group.
   *
   * Intended for cases where the parsed representation
   * of a group needs to contain its children. If not
   * needed, this property can be omitted.
   */
  addChildToGroup?: AddChildFn<ParsedGroup, ParsedDesignToken>;
}

/**
 * Thrown when `parseData()` encounters group or design token
 * data that is not a plain object.
 */
export class InvalidDataError extends Error {
  /**
   * Path to the value that is not a plain object
   */
  public path: string[];

  /**
   * The offending value.
   */
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

/**
 * Thrown when the outermost object in the data passed to `parseData()`
 * is not a group.
 */
export class InvalidStructureError extends Error {
  /**
   * The offending value.
   */
  public data: unknown;

  constructor(data: unknown) {
    super(
      `Expected a group at the root level, but encountered a design token instead`
    );
    this.name = "InvalidDataError";
    this.data = data;
  }
}

/**
 * The internal data parsing implementation.
 *
 * Recursively calls itself for nested group and
 * design token data.
 *
 * @param data  The input data to traverse and parse
 * @param config Parser config
 * @param contextFromParent Context data passed in from
 *              parent calls to this function.
 * @param path The path to the input data
 * @param addToParent A function to add the parsed data
 *              to the parent group.
 * @returns The parsed design token or group.
 */
function parseDataImpl<ParsedDesignToken, ParsedGroup, T>(
  data: unknown,
  config: ParserConfig<ParsedDesignToken, ParsedGroup, T>,
  contextFromParent?: T,
  path: string[] = [],
  parentGroup?: ParsedGroup
): ParsedDesignToken | ParsedGroup | undefined {
  if (!isPlainObject(data)) {
    throw new InvalidDataError(path, data);
  }

  const {
    isDesignTokenData,
    groupPropsToExtract,
    parseGroupData,
    parseDesignTokenData,
    addChildToGroup,
  } = config;

  let groupOrToken: ParsedGroup | ParsedDesignToken | undefined = undefined;
  if (isDesignTokenData(data)) {
    // looks like a token
    if (path.length === 0) {
      throw new InvalidStructureError(data);
    }

    groupOrToken = parseDesignTokenData(data, path, contextFromParent);
    if (addChildToGroup && path.length > 0 && parentGroup !== undefined) {
      addChildToGroup(parentGroup, path[path.length - 1], groupOrToken);
    }
  } else {
    // must be a group
    const { extracted: groupData, rest: children } = extractProperties(
      data,
      groupPropsToExtract
    );

    let contextForChildren: T | undefined;
    if (parseGroupData) {
      const parseResult = parseGroupData(groupData, path, contextFromParent);
      contextForChildren = parseResult.contextForChildren;
      groupOrToken = parseResult.group;
    }

    if (
      addChildToGroup &&
      path.length > 0 &&
      parentGroup !== undefined &&
      groupOrToken !== undefined
    ) {
      addChildToGroup(parentGroup, path[path.length - 1], groupOrToken);
    }

    for (const childName in children) {
      parseDataImpl(
        children[childName],
        config,
        contextForChildren,
        [...path, childName],
        groupOrToken
      );
    }
  }

  return groupOrToken;
}

/**
 * Parses a nested object structure representing groups
 * and design tokens, such as the data obtained by reading
 * and JSON-parsing a DTCG file.
 *
 * It will recursively traverse the input data (depth first)
 * and, using the functions provided in the config:
 *
 * 1. Check if the object is design token or group data
 * 2. Pass that data to the parsed or processed by the
 *    relevant function
 * 3. Return the outermost parsed group or design token
 *
 * @param data  The input data to traverse and parse
 * @param config  Configuration for this parser
 * @param contextFromParent Optional context data to
 *              pass into the top-most design token
 *              or group parser function call.
 * @returns The outermost parsed group or design token
 */
export function parseData<ParsedDesignToken, ParsedGroup, T>(
  data: unknown,
  config: ParserConfig<ParsedDesignToken, ParsedGroup, T>,
  contextFromParent?: T
): ParsedGroup | undefined {
  // parseDataImpl() called with an empty path will never return
  // a ParsedDesignToken
  return parseDataImpl(data, config, contextFromParent) as
    | ParsedGroup
    | undefined;
}
