import { Reference } from "../reference";
import { Type } from "../type";

export interface INodeWithChildren<ChildNodeType> {
  removeChild(child: ChildNodeType): boolean;

  getInheritedType(): Type | undefined;

  getReferencedNode(reference: Reference): ChildNodeType;
}
