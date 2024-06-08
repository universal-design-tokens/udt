import { NodeWithParent } from "../node-with-parent.js";
import { Reference } from "../reference.js";
import { Type } from "../type.js";
import { CompositeValue } from "../values/index.js";
import { MockReferencedValueResolver } from "./mock-referenced-value-resolver.js";

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
