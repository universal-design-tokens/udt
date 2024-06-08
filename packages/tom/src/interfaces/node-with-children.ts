import { Reference } from "../reference.js";
import { Type } from "../type.js";

export interface INodeWithChildren<ChildNodeType> {
  removeChild(child: ChildNodeType): boolean;

  getInheritedType(): Type | undefined;

  getReferencedNode(reference: Reference): ChildNodeType;
}
