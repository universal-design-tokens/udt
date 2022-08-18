import { isReference, Reference } from "../reference";
import { NodeWithParent } from "../node-with-parent";
import { ReferencedValueResolver } from "../interfaces/referenced-value-resolver";
import { Type } from "../type";

export type ValueCheckedFn<V> = (value: unknown) => value is V;

export abstract class CompositeValue extends NodeWithParent<ReferencedValueResolver> {
  public abstract readonly type: Type;

  private _resolveReferencedValue(reference: Reference): unknown {
    const parent = this.getParent();
    if (parent === undefined) {
      throw new Error(
        `Cannot resolve reference when composite value has no parent token`
      );
    }
    return parent.resolveReferencedValue(reference);
  }

  protected _isSuitableValueOrReference<V>(
    valueOrReference: unknown,
    valueChecker: ValueCheckedFn<V>
  ): valueOrReference is (Reference | V) {
    return (
      (isReference(valueOrReference) &&
        valueChecker(this._resolveReferencedValue(valueOrReference))) ||
      valueChecker(valueOrReference)
    );
  }

  protected _getResolvedValue<V>(
    valueOrReference: V | Reference,
    valueChecker: ValueCheckedFn<V>
  ): V {
    if (isReference(valueOrReference)) {
      const referencedValue = this._resolveReferencedValue(valueOrReference);
      if (valueChecker(referencedValue)) {
        return referencedValue;
      }
      throw new Error(`Sub-value references a value of the wrong type`);
    }
    return valueOrReference;
  }

  protected _onParentAssigned(): void {}
  protected _onParentRemoved(): void {}
}

export function isCompositeValue(value: unknown): value is CompositeValue {
  return value instanceof CompositeValue;
}
