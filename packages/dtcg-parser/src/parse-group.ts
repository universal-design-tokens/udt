import { Group } from '@udt/tom';
import { parseToken } from './parse-token';
import { extractCommonProps } from './extract-common-props';
import { isJsonObject, isTokenData } from './utils';

interface ParsedGroup {
  group: Group;
  children: any;
}

function parseGroup(name: string, dtcgData: unknown): ParsedGroup {
  const {
    commonProps,
    rest: children,
  } = extractCommonProps(dtcgData);

  const group = new Group(name, commonProps);

  return {
    group,
    children
  };
}

export function parseAndAddChildren(children: any, group: Group): void {
  for (const name in children) {
    const data = children[name];
    if (isJsonObject(data)) {
      if (isTokenData(data)) {
        group.addChild(parseToken(name, data));
      }
      else {
        const {
          group: childGroup,
          children: childChildren
        } = parseGroup(name, data);
        // Need to add child group to current group *before*
        // we parse its children, so that they will have access
        // to ancestor groups
        group.addChild(childGroup);
        parseAndAddChildren(childChildren, childGroup);
      }
    }
    else {
      throw new Error(`Unexpected ${typeof data} value encountered: ${data}`);
    }
  }
}
