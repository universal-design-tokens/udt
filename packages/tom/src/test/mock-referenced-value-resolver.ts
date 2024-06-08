import { ReferencedValueResolver } from "../interfaces/referenced-value-resolver.js";
import { Reference } from "../reference.js";

export class MockReferencedValueResolver implements ReferencedValueResolver {
  #testValues = new Map<Reference, unknown>();

  setTestValue(reference: Reference, value: unknown): void {
    this.#testValues.set(reference, value);
  }

  resolveReferencedValue(reference: Reference): unknown {
    return this.#testValues.get(reference);
  }

}
