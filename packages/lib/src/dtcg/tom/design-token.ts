import { TOMNode } from "./tom-node";
import { Type } from "../format/type";
import { DesignTokenProps } from "../format/design-token-props";
import { Extensions } from "../format/extensions";
import { isReferenceValue, referenceToPath } from "./reference";

export type TokenValue = string | number | boolean | object | null;

export class DesignToken extends TOMNode {
  public value: TokenValue;
  public extensions?: Extensions;

  /**
   * Constructs a new design token node.
   */
  constructor(name: string, { type, value, extensions, ...otherProps }: DesignTokenProps) {
    super(name, type, otherProps);

    this.value = value;
    this.type = type;
    this.extensions = extensions;
  }

  public isAlias(): boolean {
    return isReferenceValue(this.value);
  }

  public getNextReferencedToken(): DesignToken {
    if (this.isAlias() && this.getParent()) {
      const referencedNode = this.getTopParent()!.getNodeByPath(referenceToPath(this.value as string));
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
      return this.getFinalReferencedToken().value;
    }
    return this.value;
  }

  public getType(): Type {
    let type = this.type;
    if (type === undefined) {
      // Is value a reference?
      if (this.isAlias()) {
        return this.getFinalReferencedToken().getType();
      }

      // Are we inheriting a type from parent group(s)
      if (this.hasParent() && (type = this.getParent()!.getInheritedType()) !== undefined) {
        return type;
      }

      // Need to infer one of the JSON types from the value
      switch (typeof this.value) {
        case "string":
          return Type.STRING;

        case "number":
          return Type.NUMBER;

        case "boolean":
          return Type.BOOLEAN;

        case "object": {
          if (this.value === null) {
            return Type.NULL;
          }
          if (Array.isArray(this.value)) {
            return Type.ARRAY;
          }

          return Type.OBJECT;
        }

        default: {
          throw new Error(
            `Unsupported value (JS type is: ${typeof this.value})`
          );
        }
      }
    }

    return type;
  }

  public toJSON(): object {
    return {
      ...(super.toJSON()),

      value: this.value,
      extensions: this.extensions,
    }
  }
}
