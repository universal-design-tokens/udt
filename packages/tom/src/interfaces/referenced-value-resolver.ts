import { Reference } from "../reference";

export interface ReferencedValueResolver {
  resolveReferencedValue(reference: Reference): unknown
}
