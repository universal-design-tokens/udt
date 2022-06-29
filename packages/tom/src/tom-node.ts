import { Type, allTypes } from "./type";
import { INodeWithChildren } from "./interfaces/node-with-children";

type ParentNode = TOMNode & INodeWithChildren<TOMNode>;

const reservedCharactersRegEx = /\{\}\./g;

/**
 * Checks that the given value can be used as a name for
 * a token or group.
 *
 * Names must:
 * - be strings
 * - cannot begin with the character `$`
 * - cannot contain `{`, `}` or `.` characters
 *
 * @param name
 * @returns
 */
export function isValidName(name: any): name is string {
  return typeof name === 'string' && name[0] !== '$' && !reservedCharactersRegEx.test(name);
}

/**
 * Checks that the given value is one of the DTCG type values.
 *
 * @param type
 * @returns
 */
export function isValidType(type: any): type is Type {
  return typeof type === 'string' && allTypes.includes(type);
}

export interface TOMNodeCommonProps {
  type?: Type;
  description?: string;
}

export abstract class TOMNode {
  #parent?: ParentNode;
  #name: string;
  #type?: Type;
  #description?: string;


  constructor(name: string, {type, description}: TOMNodeCommonProps = {}) {
    if (isValidName(name)) {
      this.#name = name;
    }
    else {
      throw new Error(`"${name}" is not a valid TOM node name.`);
    }

    this.type = type;
    this.description = description;
  }

  public get name(): string {
    return this.#name;
  }

  public set name(name: string) {
    if (isValidName(name)) {
      this.#name = name;
    }
    else {
      throw new Error(`"${name}" is not a valid TOM node name.`);
    }
  }


  public get type(): Type | undefined {
    return this.#type;
  }

  public set type(type: Type | undefined) {
    if (isValidType(type) || type === undefined) {
      this.#type = type;
    }
    else {
      throw new Error(`${type} is not a valid type value.`);
    }
  }

  public get description(): string | undefined {
    return this.#description;
  }

  public set description(description: string | undefined) {
    if (typeof description === 'string' || description === undefined) {
      this.#description = description;
    }
    else {
      throw new Error(`${description} is not a valid type description.`);
    }
  }

  public abstract isValid(): boolean;

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

  protected static _assignParent(child: TOMNode, parent: ParentNode) {
    child.#parent = parent;
  }

  protected static _clearParent(child: TOMNode) {
    child.#parent = undefined;
  }
}
