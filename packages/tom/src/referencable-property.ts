import { Reference, isReference } from "./reference";
import { TOMNode } from "./tom-node";

export type PropertyGetter<T> = (node: TOMNode) => T | Reference;

export function resolveReference<T>(
  reference: Reference,
  sourceNode: TOMNode,
  propertyGetter: PropertyGetter<T>
): T {
  let nextReference: Reference = reference;

  do {
    const referencedNode = sourceNode.getTopParent()?.getReferencedNode(nextReference);
    if (referencedNode === undefined) {
      throw new Error('Node has no parent or reference points nowhere');
    }
    else if (referencedNode === sourceNode) {
      throw new Error(`Reference loop detected ("${sourceNode.getName}"" references itself)`);
    }

    const referencedProperty = propertyGetter(referencedNode);
    if (isReference(referencedProperty)) {
      nextReference = referencedProperty;
      continue;
    }
    return referencedProperty;
  }
  while (true);
}
