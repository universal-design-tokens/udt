export interface NodeWithChildren<ChildNodeType> {
  removeChild(child: ChildNodeType): boolean;

  getNodeByPath(path: string[]): ChildNodeType;
}
