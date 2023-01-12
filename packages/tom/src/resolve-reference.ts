import { Reference, isReference } from "./reference";

export type PropertyGetter<N, V> = (node: N) => V | Reference;

export type DereferenceFn<N> = (node: N, reference: Reference) => N | undefined;

/**
 * Retrieves a referenced node's property ultimate value.
 *
 * If the referenced node's property returns another reference, that
 * will be followed. This process repeats until a node that returns
 * an actual (non-reference) value is found.
 *
 * @param reference
 * @param sourceNode
 * @param getProperty
 * @returns
 */
export function resolveReference<N, V>(
  reference: Reference,
  sourceNode: N,
  dereference: DereferenceFn<N>,
  getProperty: PropertyGetter<N, V>
): V {
  let nextReference: Reference = reference;

  do {
    const referencedNode = dereference(sourceNode, nextReference);
    if (referencedNode === undefined) {
      throw new Error('Reference points nowhere');
    }
    else if (referencedNode === sourceNode) {
      throw new Error(`Reference loop detected`);
    }

    const referencedProperty = getProperty(referencedNode);
    if (isReference(referencedProperty)) {
      nextReference = referencedProperty;
      continue;
    }
    return referencedProperty;
  }
  while (true);
}
