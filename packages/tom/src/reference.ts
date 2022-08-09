export class Reference {
  path: string[];

  constructor(path: string[]) {
    this.path = path;
  }
}

export function isReference(value: unknown): value is Reference {
  return value instanceof Reference;
}
