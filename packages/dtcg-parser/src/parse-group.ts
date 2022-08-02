import { Group } from '@udt/tom';
import { parseToken } from './parse-token';
import { extractCommonProps } from './extract-common-props';
import { isJsonObject, isTokenData } from './utils';

export function parseChildren(children: any, group: Group): void {
  for (const name in children) {
    const data = children[name];
    if (isJsonObject(data)) {
      if (isTokenData(data)) {
        const token = parseToken(name, data);
        group.addChild(token);
      }
      else {
        group.addChild(parseGroup(name, data));
      }
    }
    else {
      throw new Error(`Unexpected ${typeof data} value encountered: ${data}`);
    }
  }
}

export function parseGroup(name: string, dtcgData: unknown): Group {
  const {
    commonProps,
    rest: children,
  } = extractCommonProps(dtcgData);

  const group = new Group(name, commonProps);
  parseChildren(children, group);

  return group;
}
