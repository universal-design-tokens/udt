import { TOMNode, TOMNodeCommonProps } from "./tom-node";
import { Type } from "./type";
import { isReferenceValue, referenceToPath } from "./reference";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };


const permittedJsonTypes = ['string', 'number', 'boolean', 'object'];

function isJsonValue(value: any): value is JsonValue {
  return permittedJsonTypes.includes(typeof value);
}

export class DesignToken extends TOMNode {
  #value: JsonValue;
  #extensions: Map<string, JsonValue>;

  /**
   * Constructs a new design token node.
   */
  constructor(name: string, value: JsonValue, commonProps: TOMNodeCommonProps = {} ) {
    super(name, commonProps);

    if (isJsonValue(value)) {
      this.#value = value;
    }
    else {
      throw new Error(`${value} is not a valid token value`);
    }

    this.#extensions = new Map<string, JsonValue>();
  }

  public isAlias(): boolean {
    return isReferenceValue(this.#value);
  }

  public getNextReferencedToken(): DesignToken {
    if (isReferenceValue(this.#value) && this.hasParent()) {
      const referencedNode = this.getTopParent()!.getNodeByPath(referenceToPath(this.#value));
      if (referencedNode instanceof DesignToken) {
        return referencedNode;
      }
    }
    throw new Error('Reference is invalid');
  }

  public getFinalReferencedToken(): DesignToken {
    let nextToken: DesignToken = this;
    while(nextToken.isAlias()) {
      nextToken = nextToken.getNextReferencedToken();
      if (nextToken === this) {
        throw new Error(`Reference loop detected ("${this.getName}"" references itself)`);
      }
    }
    return nextToken;
  }

  public getResolvedValue(): JsonValue {
    if (this.isAlias()) {
      return this.getFinalReferencedToken().value;
    }
    return this.#value;
  }

  public get value(): JsonValue {
    return this.#value;
  }

  public set value(value: any) {
    if (isJsonValue(value)) {
      this.#value = value;
    }
    else {
      throw new Error(`${value} is not a valid token value`);
    }
  }

  public getResolvedType(): Type {
    let type = this.getType();
    if (type === undefined) {
      // Is value a reference?
      if (this.isAlias()) {
        return this.getFinalReferencedToken().getResolvedType();
      }

      // Are we inheriting a type from parent group(s)
      if (this.hasParent() && (type = this.getParent()!.getInheritedType()) !== undefined) {
        return type;
      }

      // Need to infer one of the JSON types from the value
      switch (typeof this.#value) {
        case "string":
          return Type.STRING;

        case "number":
          return Type.NUMBER;

        case "boolean":
          return Type.BOOLEAN;

        case "object": {
          if (this.#value === null) {
            return Type.NULL;
          }
          if (Array.isArray(this.#value)) {
            return Type.ARRAY;
          }

          return Type.OBJECT;
        }

        default: {
          throw new Error(
            `Unsupported value (JS type is: ${typeof this.#value})`
          );
        }
      }
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
    this.#extensions.set(key, value)
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

}
