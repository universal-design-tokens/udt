export abstract class NodeWithParent<PT> {
  #parent?: PT;

  public getParent(): PT | undefined {
    return this.#parent;
  }

  protected abstract _onParentAssigned(): void;

  protected abstract _onParentRemoved(): void;

  protected static _assignParent<T>(child: NodeWithParent<T>, parent: T) {
    child.#parent = parent;
    child._onParentAssigned();
  }

  protected static _clearParent<T>(child: NodeWithParent<T>) {
    child.#parent = undefined;
    child._onParentRemoved();
  }
}
