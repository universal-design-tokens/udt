export function isTokenData(data: Record<string, any>): boolean {
  return data.$value !== undefined;
}

export function isJsonObject(data: any): data is Record<string, any> {
  return typeof data === 'object' && data !== null;
}
