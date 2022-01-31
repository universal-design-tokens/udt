import { TOMNode, isValidName } from './tom-node';
import { INodeWithChildren } from './interfaces/node-with-children';
import { DesignToken } from './design-token';
import { isTokenData } from '../parser/utils';
import { Type } from './type';

export type TokenOrGroup = DesignToken | Group;

export class Group extends TOMNode implements INodeWithChildren<TokenOrGroup> {
  #children: Set<TokenOrGroup>;

  constructor(name: string, {$type, $description, ...children}: any = {}) {
    super(name, { $type, $description });

    this.#children = new Set();

    for (const name in children) {
      if (!isValidName(name)) {
        throw new Error(`${name} is not a valid group or token name.`);
      }

      const data = children[name];
      if (isTokenData(data)) {
        this.addChild(new DesignToken(name, data));
      }
      else {
        this.addChild(new Group(name, data));
      }
    }
  }


  public removeChild(child: TokenOrGroup): boolean {
    if (this.#children.has(child)) {
      this.#children.delete(child);
      TOMNode._clearParent(child);
      return true;
    }
    // not our child
    return false;
  }

  public addChild(child: TokenOrGroup): void {
    if (this.#children.has(child)) {
      // Already a child, so do nothing
      return;
    }

    if (child.hasParent()) {
      // Need to remove from other parent first
      child.getParent()!.removeChild(child);
    }

    this.#children.add(child);
    TOMNode._assignParent(child, this);
  }

  public hasChild(nodeOrName: TokenOrGroup | string): boolean {
    if (typeof nodeOrName === 'string') {
      for (const child of this) {
        if (child.name === nodeOrName) {
          return true;
        }
      }
      return false;
    }
    else {
      return this.#children.has(nodeOrName);
    }
  }

  public getChild(name: string): TokenOrGroup | undefined {
    for (const child of this) {
      if (child.name === name) {
        return child;
      }
    }
  }

  public getNodeByPath(path: string[]): TokenOrGroup {
    if (path.length === 0) {
      throw new Error('Invalid path. Paths must have at least one segment');
    }

    let node: TokenOrGroup = this;
    for (let i=0; i < path.length; i++) {
      if (!(node instanceof Group)) {
        throw new Error(`Invalid path: "${node.name}" is not a node that can have children`);
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

  getType(): Type | undefined {
    const ownType = this.getOwnType();
    if (ownType === undefined && this.hasParent()) {
      return this.getParent()!.getType();
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

  public toJSON(): object {
    const childMap = [...this.#children].reduce((prevChildMap, child) => {
      prevChildMap[child.name] = child.toJSON();
      return prevChildMap;
    }, {} as any);

    return {
      ...(super.toJSON()),

      ...childMap,
    };
  }
}
