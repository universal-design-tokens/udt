import { TOMNode } from "../tom-node";
import { Type } from "../type";
import { INodeWithChildren } from "../interfaces/node-with-children";
import { NodeWithParent } from "../node-with-parent";
import { Reference } from "../reference";

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
  public removeChild(child: MockTOMNode): boolean {
    throw new Error('not implemented');
  }

  /* istanbul ignore next */
  public getInheritedType(): Type | undefined {
    throw new Error('not implemented');
  }

  /* istanbul ignore next */
  public getReferencedNode(reference: Reference): MockTOMNode {
    throw new Error('not implemented');
  }
}
