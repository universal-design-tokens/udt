import { TOMNode, TOMNodeCommonProps } from "./tom-node";
import { Type } from "./type";
import { Value, JsonValue, identifyJsonType, NOT_JSON } from "./values";
import { Reference } from "./reference";

export function isReference(value: unknown): value is Reference {
  return value instanceof Reference;
}

export type DeferredValue = (ownOrInheritedType?: Type) => Value | Reference;

export class DesignToken extends TOMNode {
  #value: Value | Reference | DeferredValue;
  #extensions: Map<string, JsonValue>;

  /**
   * Constructs a new design token node.
   */
  constructor(
    name: string,
    value: Value | Reference | DeferredValue,
    commonProps: TOMNodeCommonProps = {}
  ) {
    super(name, commonProps);

    // if (isJsonValue(value)) {
    this.#value = value;
    // }
    // else {
    //   throw new Error(`${value} is not a valid token value`);
    // }

    this.#extensions = new Map<string, JsonValue>();
  }

  public isAlias(): boolean {
    return isReference(this.#value);
  }

  public getNextReferencedToken(): DesignToken {
    const value = this.getValue();
    if (isReference(value) && this.hasParent()) {
      const referencedNode = this.getTopParent()!.getReferencedNode(value);
      if (referencedNode instanceof DesignToken) {
        return referencedNode;
      }
    }
    throw new Error("Reference is invalid");
  }

  public getFinalReferencedToken(): DesignToken {
    let nextToken: DesignToken = this;
    while (nextToken.isAlias()) {
      nextToken = nextToken.getNextReferencedToken();
      if (nextToken === this) {
        throw new Error(
          `Reference loop detected ("${this.getName()}"" references itself)`
        );
      }
    }
    return nextToken;
  }

  public getResolvedValue(): Value {
    const value = this.getValue()
    if (isReference(value)) {
      return this.getFinalReferencedToken().getValue() as Value;
    }
    return value;
  }


  public getValue(): Value | Reference {
    if (typeof this.#value === 'function') {
      throw new Error(`Token "${this.getName()}" has pending value`);
    }
    return this.#value;
  }

  public setValue(value: Value | Reference): void {
    // if (isJsonValue(value)) {
    this.#value = value;
    // }
    // else {
    //   throw new Error(`${value} is not a valid token value`);
    // }
  }

  private __getOwnOrInheritedType(): Type | undefined {
    let type = this.getType();
    if (type === undefined) {
      // Are we inheriting a type from parent group(s)
      if (
        this.hasParent() &&
        (type = this.getParent()!.getInheritedType()) !== undefined
      ) {
        return type;
      }
    }
    return type;
  }

  public getResolvedType(): Type {
    let type = this.getType();
    if (type === undefined) {
      // Is value a reference?
      if (this.isAlias()) {
        return this.getFinalReferencedToken().getResolvedType();
      }

      // Are we inheriting a type from parent group(s)
      if (
        this.hasParent() &&
        (type = this.getParent()!.getInheritedType()) !== undefined
      ) {
        return type;
      }

      // Need to infer one of the JSON types from the value
      const inferredJsonType = identifyJsonType(this.getValue());
      if (inferredJsonType === NOT_JSON) {
        throw new Error(
          `Unsupported value (JS type is: ${typeof this.getValue()})`
        );
      }
      type = inferredJsonType;
    }
    return type;
  }

  public hasExtension(key: string): boolean {
    return this.#extensions.has(key);
  }

  public getExtension(key: string): JsonValue | undefined {
    return this.#extensions.get(key);
  }

  public setExtension(key: string, value: JsonValue): void {
    this.#extensions.set(key, value);
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

  public extensions(): IterableIterator<[string, JsonValue]> {
    return this.#extensions.entries();
  }

  public isValid(): boolean {
    // TODO: Check that value is valid for our type
    return true;
  }

  protected _onParentAssigned(): void {
    if (typeof this.#value === "function") {
      this.#value = this.#value(this.__getOwnOrInheritedType());
    }
  };
}
