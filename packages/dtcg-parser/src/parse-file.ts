import { DtcgFile } from '@udt/tom';
import { parseChildren } from './parse-group';
import { extractCommonProps } from './extract-common-props';

export function parseFile(dtcgData: any) {
  const {
    commonProps,
    rest: children,
  } = extractCommonProps(dtcgData);

  const file = new DtcgFile(commonProps);

  parseChildren(children, file);

  return file;
}

