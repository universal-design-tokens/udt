import { TOMNode } from "../tom-node.js";
import { Type } from "../type.js";
import { INodeWithChildren } from "../interfaces/node-with-children.js";
import { NodeWithParent } from "../node-with-parent.js";
import { Reference } from "../reference.js";

export class MockTOMNode
  extends TOMNode
  implements INodeWithChildren<MockTOMNode>
{
  public setParent(parent: MockTOMNode): void {
    NodeWithParent._assignParent(this, parent);
  }

  // from TOMNode

  /* istanbul ignore next */
  public isValid(): boolean {
    throw new Error('not implemented');
  }

  // From INodeWithChildren:

  /* istanbul ignore next */
  public removeChild(_child: MockTOMNode): boolean {
    throw new Error('not implemented');
  }

  /* istanbul ignore next */
  public getInheritedType(): Type | undefined {
    throw new Error('not implemented');
  }

  /* istanbul ignore next */
  public getReferencedNode(_reference: Reference): MockTOMNode {
    throw new Error('not implemented');
  }
}
