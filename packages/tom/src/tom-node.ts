import { Type, allTypes } from "./type";
import { INodeWithChildren } from "./interfaces/node-with-children";
import { NodeWithParent } from "./node-with-parent";
import { TOMInvalidAssignmentError } from "./exceptions";

type ParentNode = TOMNode & INodeWithChildren<TOMNode>;

const reservedCharactersRegEx = /[\{\}\.]/;

/**
 * Checks that the given value can be used as a name for
 * a token or group.
 *
 * Names must:
 * - be strings
 * - cannot begin with the character `$`
 * - cannot contain `{`, `}` or `.` characters
 *
 * @param name  The name to check
 * @returns     `true` is the name is valid, `false` otherwise.
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

export abstract class TOMNode extends NodeWithParent<ParentNode> {
  #name: string;
  #type?: Type;
  #description?: string;


  constructor(name: string, {type, description}: TOMNodeCommonProps = {}) {
    super();
    if (isValidName(name)) {
      this.#name = name;
    }
    else {
      throw new TOMInvalidAssignmentError('name', name);
    }

    this.setType(type);
    this.setDescription(description);
  }

  public getName(): string {
    return this.#name;
  }

  public setName(name: string): void {
    if (isValidName(name)) {
      this.#name = name;
    }
    else {
      throw new TOMInvalidAssignmentError('name', name);
    }
  }


  public getType(): Type | undefined {
    return this.#type;
  }

  public setType(type: Type | undefined): void {
    if (isValidType(type) || type === undefined) {
      this.#type = type;
    }
    else {
      throw new TOMInvalidAssignmentError('type', type);
    }
  }

  public getDescription(): string | undefined {
    return this.#description;
  }

  public setDescription(description: string | undefined) {
    if (typeof description === 'string' || description === undefined) {
      this.#description = description;
    }
    else {
      throw new TOMInvalidAssignmentError('description', description);
    }
  }

  public abstract isValid(): boolean;

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
    return this.getParent() !== undefined;
  }

  /**
   * Returns an array of node names from the root
   * down to this node.
   */
  public getPath(): string[] {
    const parentNode = this.getParent();
    const name = this.getName();

    if (parentNode === undefined) {
      return [name];
    }
    else {
      const parentPath = parentNode.getPath();
      parentPath.push(name);
      return parentPath;
    }
  }

  protected _onParentAssigned(): void {};

  protected _onParentRemoved(): void {};
}
