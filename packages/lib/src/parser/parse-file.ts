import { DtcgFile } from '../tom/dtcg-file';
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

