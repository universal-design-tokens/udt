export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isNull(value: any): value is null {
  return typeof value === null;
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !isArray(value);
}
