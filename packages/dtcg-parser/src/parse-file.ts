import { RootGroup } from '@udt/tom';
import { parseAndAddChildren } from './parse-group.js';
import { extractCommonProps } from './extract-common-props.js';

export function parseFile(dtcgData: unknown) {
  const {
    commonProps,
    rest: children,
  } = extractCommonProps(dtcgData);
  const file = new RootGroup(commonProps);
  parseAndAddChildren(children, file);
  return file;
}

