import { NodeWithParent } from "../node-with-parent";
import { Reference } from "../reference";
import { Type } from "../type";
import { CompositeValue } from "../values";
import { MockReferencedValueResolver } from "./mock-referenced-value-resolver";

export class MockCompositeValue extends CompositeValue {
  public readonly type = Type.BORDER;

  public checkValue(value: unknown): value is number {
    return typeof value === 'number';
  }

  public value: number | Reference;

  constructor(initialValue: number | Reference = 0) {
    super();
    this.value = initialValue;
  }

  setParent(parent: MockReferencedValueResolver) {
    NodeWithParent._assignParent(this, parent);
  }

  isSuitableValueOrReference(value: unknown): value is number | Reference {
    return this._isSuitableValueOrReference(value, this.checkValue);
  }

  getResolvedValue(): number | Reference {
    return this._getResolvedValue(this.value, this.checkValue);
  }
}
