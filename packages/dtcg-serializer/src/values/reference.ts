import { Reference } from "@udt/tom";

export type DtcgReference = string;

export function serializeReference(reference: Reference): DtcgReference {
  return `{${reference.path.join('.')}}`;
}
