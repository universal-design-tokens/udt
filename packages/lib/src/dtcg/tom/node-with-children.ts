import { Type } from "../format/type";

export interface NodeWithChildren<ChildNodeType> {
  removeChild(child: ChildNodeType): boolean;

  getInheritedType(): Type | undefined;

  getNodeByPath(path: string[]): ChildNodeType;
}
