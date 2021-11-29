import { DesignTokenProps } from '../format/design-token-props';

export function isTokenData(data: any): data is DesignTokenProps {
  return typeof data === 'object' && data.value !== undefined;
}
