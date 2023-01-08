import { RootGroup } from '@udt/tom';
import { parseAndAddChildren } from './parse-group';
import { extractCommonProps } from './extract-common-props';
import { addExtensions } from './add-extensions';

export function parseFile(dtcgData: unknown) {
  const {
    commonProps,
    extensions,
    rest: children,
  } = extractCommonProps(dtcgData);

  const file = new RootGroup(commonProps);

  addExtensions(file, extensions);

  parseAndAddChildren(children, file);

  return file;
}

