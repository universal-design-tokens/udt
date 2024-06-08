import { TOMNode, TOMNodeCommonConstructorProps } from './tom-node.js';
import { INodeWithChildren } from './interfaces/node-with-children.js';
import { DesignToken } from './design-token.js';
import { Type } from './type.js';
import { Reference } from './reference.js';
import { NodeWithParent } from './node-with-parent.js';

export type TokenOrGroup = DesignToken | Group;

export class Group extends TOMNode implements INodeWithChildren<TokenOrGroup> {
  #children: Set<TokenOrGroup>;

  constructor(name: string, props: TOMNodeCommonConstructorProps = {}) {
    super(name, props);

    this.#children = new Set();
  }


  public removeChild(child: TokenOrGroup): boolean {
    if (this.#children.has(child)) {
      this.#children.delete(child);
      NodeWithParent._clearParent(child);
      return true;
    }
    // not our child
    return false;
  }

  public addChild(child: TokenOrGroup): void {
    if (this.#children.has(child)) {
      // Already the child, so do nothing
      return;
    }

    if (child.hasParent()) {
      // Need to remove from other parent first
      child.getParent()!.removeChild(child);
    }

    const existingChild = this.getChild(child.getName());
    if (existingChild !== undefined) {
      // We already have a child with the same name, so need
      // to remove that first
      this.removeChild(existingChild);
    }

    this.#children.add(child);
    NodeWithParent._assignParent(child, this);
  }

  public hasChild(nodeOrName: TokenOrGroup | string): boolean {
    if (typeof nodeOrName === 'string') {
      for (const child of this) {
        if (child.getName() === nodeOrName) {
          return true;
        }
      }
      return false;
    }
    else {
      return this.#children.has(nodeOrName);
    }
  }

  public hasChildren(): boolean {
    return this.childCount() > 0;
  }

  public childCount(): number {
    return this.#children.size;
  }

  public getChild(name: string): TokenOrGroup | undefined {
    for (const child of this) {
      if (child.getName() === name) {
        return child;
      }
    }
  }

  public getReferencedNode(reference: Reference): TokenOrGroup {
    const path = reference.path;
    if (path.length === 0) {
      return this;
    }

    let node: TokenOrGroup = this;
    for (let i=0; i < path.length; i++) {
      if (!(node instanceof Group)) {
        throw new Error(`Invalid path: "${node.getName}" is not a node that can have children`);
      }

      const name = path[i];
      const nextNode = node.getChild(name);
      if (nextNode === undefined) {
        throw new Error(`Invalid path: Segment "${name}" does not exist`);
      }
      node = nextNode;
    }

    return node;
  }

  getInheritedType(): Type | undefined {
    const ownType = this.getType();
    if (ownType === undefined && this.hasParent()) {
      return this.getParent()!.getInheritedType();
    }
    return ownType;
  }


  public [Symbol.iterator]() {
    return this.#children.values();
  }

  public isValid(): boolean {
      for (const child of this) {
        if (!child.isValid()) {
          return false;
        }
      }
      // All children must have been valid
      return true;
  }

  public *traverseTokens(recursive = true): Generator<DesignToken> {
    for (const childNode of this) {
      if (recursive && childNode instanceof Group) {
        yield* childNode.traverseTokens();
      }
      else if (childNode instanceof DesignToken) {
        yield childNode;
      }
    }
  }
}
