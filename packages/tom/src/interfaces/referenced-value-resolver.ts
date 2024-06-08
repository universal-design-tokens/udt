import { Reference } from "../reference.js";

export interface ReferencedValueResolver {
  resolveReferencedValue(reference: Reference): unknown
}
