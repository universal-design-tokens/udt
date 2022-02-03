import { TOMNode, TOMNodeCommonProps } from "./tom-node";
import { Type } from "./type";
import { isReferenceValue, referenceToPath } from "./reference";

export type TokenValue = string | number | boolean | object | null;

type Extensions = Record<string, any>;

function isValidValue(value: any): value is TokenValue {
  return value !== undefined; // TODO: needs improving to detect functions, symbols, bigint, etc.
}

function isValidExtensions(extensions: any): extensions is Extensions {
  return typeof extensions === 'object' && extensions !== null && !Array.isArray(extensions);
}

export interface DesignTokenProps extends TOMNodeCommonProps {
  extensions?: Extensions;
}

export class DesignToken extends TOMNode {
  #value: TokenValue;
  #extensions?: Extensions;

  /**
   * Constructs a new design token node.
   */
  constructor(name: string, value: TokenValue, { extensions, ...commonProps }: DesignTokenProps = {} ) {
    super(name, commonProps);

    if (isValidValue(value)) {
      this.#value = value;
    }
    else {
      throw new Error(`${value} is not a valid token value`);
    }

    if (isValidExtensions(extensions) || extensions === undefined) {
      this.#extensions = extensions;
    }
    else {
      throw new Error(`${extensions} is not a valid extensions object`);
    }
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
        throw new Error(`Reference loop detected ("${this.name}"" references itself)`);
      }
    }
    return nextToken;
  }

  public getValue(): TokenValue {
    if (this.isAlias()) {
      return this.getFinalReferencedToken().#value;
    }
    return this.#value;
  }

  public getOwnValue(): TokenValue {
    return this.#value;
  }

  public setValue(value: any): void {
    if (isValidValue(value)) {
      this.#value = value;
    }
    else {
      throw new Error(`${value} is not a valid token value`);
    }
  }

  public getType(): Type {
    let type = this.getOwnType();
    if (type === undefined) {
      // Is value a reference?
      if (this.isAlias()) {
        return this.getFinalReferencedToken().getType();
      }

      // Are we inheriting a type from parent group(s)
      if (this.hasParent() && (type = this.getParent()!.getType()) !== undefined) {
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

  public isValid(): boolean {
      // TODO: Check that value is valid for our type
      return true;
  }

  public toJSON(): object {
    return {
      ...(super.toJSON()),

      $value: this.#value,
      $extensions: this.#extensions,
    }
  }
}
