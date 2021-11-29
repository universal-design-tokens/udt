import { CommonProps } from "../format/common-props";
import { Type } from "../format/type";
import { NodeWithChildren } from "./node-with-children";

type ParentNode = TOMNode & NodeWithChildren<TOMNode>;

export abstract class TOMNode {
  #parent?: ParentNode;

  public name: string;
  public description?: string;
  public type?: Type;

  constructor(name: string, type?: Type, props?: CommonProps) {
    const {
      description
    } = props || {};

    this.name = name;
    this.type = type;
    this.description = description;
  }

  public getParent(): ParentNode | undefined {
    return this.#parent;
  }

  /**
   * Retrieves this node's uppermost parent, if any.
   */
  public getTopParent(): ParentNode | undefined {
    let parent = this.getParent();
    if (parent === undefined) {
      return undefined;
    } else {
      let previousParent: ParentNode = parent;
      while (parent !== undefined) {
        previousParent = parent;
        parent = parent.getParent();
      }
      return previousParent;
    }
  }

  /**
   * Retrieves this node's uppermost parent or itself,
   * if there is no parent.
   *
   * If this node has no parents it is its own root
   * and will be returned.
   */
  public getRoot(): this | ParentNode {
    const topParent = this.getTopParent();
    if (topParent === undefined) {
      return this;
    }
    return topParent;
  }

  /**
   * Checks if this node has a parent.
   */
   public hasParent(): boolean {
    return this.#parent !== undefined;
  }

  /**
   * Returns an array of node names from the root
   * down to this node.
   */
  public getPath(): string[] {
    const parentNode = this.getParent();
    const name = this.name;

    if (parentNode === undefined) {
      return [name];
    }
    else {
      const parentPath = parentNode.getPath();
      parentPath.push(name);
      return parentPath;
    }
  }

  public toJSON(): object {
    return {
      type: this.type,
      description: this.description,
    }
  }

  protected static _assignParent(child: TOMNode, parent: ParentNode) {
    child.#parent = parent;
  }

  protected static _clearParent(child: TOMNode) {
    child.#parent = undefined;
  }
}
