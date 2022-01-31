export function isTokenData(data: any): boolean {
  return typeof data === 'object' && data.$value !== undefined;
}
