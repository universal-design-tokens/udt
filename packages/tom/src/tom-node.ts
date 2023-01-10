import { Type, allTypes } from "./type";
import { INodeWithChildren } from "./interfaces/node-with-children";
import { NodeWithParent } from "./node-with-parent";
import { TOMInvalidAssignmentError } from "./exceptions";
import { Reference } from "./reference";

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
  return (
    typeof name === "string" &&
    name[0] !== "$" &&
    !reservedCharactersRegEx.test(name)
  );
}

/**
 * Checks that the given value is one of the DTCG type values.
 *
 * @param type
 * @returns
 */
export function isValidType(type: any): type is Type {
  return typeof type === "string" && allTypes.includes(type);
}

export interface ExtensionsMap {
  [key: string]: any;
}

export interface TOMNodeCommonConstructorProps {
  type?: Type;
  description?: string;
  extensions?: ExtensionsMap;
}

export abstract class TOMNode extends NodeWithParent<ParentNode> {
  #name: string;
  #type?: Type;
  #description?: string;
  #extensions: Map<string, any>;

  constructor(
    name: string,
    { type, description, extensions }: TOMNodeCommonConstructorProps = {}
  ) {
    super();
    if (isValidName(name)) {
      this.#name = name;
    } else {
      throw new TOMInvalidAssignmentError("name", name);
    }

    this.setType(type);
    this.setDescription(description);
    this.#extensions = new Map<string, any>();
    if (extensions !== undefined) {
      this.setExtensions(extensions);
    }
  }

  public getName(): string {
    return this.#name;
  }

  public setName(name: string): void {
    if (isValidName(name)) {
      this.#name = name;
    } else {
      throw new TOMInvalidAssignmentError("name", name);
    }
  }

  public getType(): Type | undefined {
    return this.#type;
  }

  public setType(type: Type | undefined): void {
    if (isValidType(type) || type === undefined) {
      this.#type = type;
    } else {
      throw new TOMInvalidAssignmentError("type", type);
    }
  }

  public getDescription(): string | undefined {
    return this.#description;
  }

  public setDescription(description: string | undefined) {
    if (typeof description === "string" || description === undefined) {
      this.#description = description;
    } else {
      throw new TOMInvalidAssignmentError("description", description);
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
   *
   * If this node is the root, then an empty path
   * will be returned.
   */
  public getPath(): string[] {
    const parentNode = this.getParent();
    const name = this.getName();

    if (parentNode === undefined) {
      return [];
    } else {
      const parentPath = parentNode.getPath();
      parentPath.push(name);
      return parentPath;
    }
  }

  public getReference(): Reference {
    return new Reference(this.getPath());
  }

  protected _onParentAssigned(): void {}

  protected _onParentRemoved(): void {}

  public hasExtension(key: string): boolean {
    return this.#extensions.has(key);
  }

  public getExtension(key: string): any | undefined {
    return this.#extensions.get(key);
  }

  public setExtension(key: string, value: any): void {
    this.#extensions.set(key, value);
  }

  public setExtensions(extensions: ExtensionsMap): void {
    for (const key of Object.keys(extensions)) {
      this.setExtension(key, extensions[key]);
    }
  }

  public deleteExtension(key: string): boolean {
    return this.#extensions.delete(key);
  }

  public clearExtensions(): void {
    this.#extensions.clear();
  }

  public hasExtensions(): boolean {
    return this.#extensions.size > 0;
  }

  public extensions(): IterableIterator<[string, any]> {
    return this.#extensions.entries();
  }
}
