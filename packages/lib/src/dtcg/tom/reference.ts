
const referenceRegex = /^\{[^\.\{\}]+(\.[^\.\{\}]+)*\}$/;

export function isReferenceValue(value: any): value is string {
  return typeof value === 'string' && referenceRegex.test(value);
}

export function referenceToPath(referenceValue: string): string[] {
  if (!isReferenceValue(referenceValue)) {
    throw new Error(`"${referenceValue}" is not a valid reference`);
  }
  return referenceValue.slice(1, -1).split('.');
}

export function pathToReference(path: string[]) {
  return `{${path.join('.')}}`;
}
