import { Type } from "../type";

export interface INodeWithChildren<ChildNodeType> {
  removeChild(child: ChildNodeType): boolean;

  getInheritedType(): Type | undefined;

  getNodeByPath(path: string[]): ChildNodeType;
}
