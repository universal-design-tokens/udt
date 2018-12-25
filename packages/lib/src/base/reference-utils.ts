export const REFERENCE_PREFIX = '@';
export const ESCAPE_CHAR = '\\';

export function idToReference(id: string) {
  return `${REFERENCE_PREFIX}${id}`;
}

/*
  @foo -> \@foo
  \foo -> \\foo

  foo -> foo
*/
export function escapeStringValue(strVal: string) {
  if (strVal[0] === REFERENCE_PREFIX || strVal[0] === ESCAPE_CHAR) {
    return `${ESCAPE_CHAR}${strVal}`;
  }
  return strVal;
}

/*
  \@foo -> @foo
  \\foo -> \foo

  foo -> foo
*/
export function unescapeStringValue(strVal: string) {
  if (strVal[0] === ESCAPE_CHAR && (strVal[1] === REFERENCE_PREFIX || strVal[1] === ESCAPE_CHAR)) {
    return strVal.substring(1);
  }
  return strVal;
}

export function isReference(val: string) {
  return val[0] === REFERENCE_PREFIX;
}
