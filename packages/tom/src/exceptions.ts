
export class TOMInvalidAssignmentError extends Error {
  property: string;
  value: any;

  constructor(property: string, value: any) {
    super(`Invalid assignment of ${typeof value === 'string' ? `"${value}"` : typeof value} to ${property} property of a TOM node.`);
    this.name = 'TOMInvalidAssignmentError';
    this.property = property;
    this.value = value;
  }
}
