import { RootGroup } from '@udt/tom';
import { parseAndAddChildren } from './parse-group';
import { extractCommonProps } from './extract-common-props';

export function parseFile(dtcgData: unknown) {
  const {
    commonProps,
    rest: children,
  } = extractCommonProps(dtcgData);
  const file = new RootGroup(commonProps);
  parseAndAddChildren(children, file);
  return file;
}

