import { TOMNode } from "./tom-node";
import { Type } from "../format/type";
import { DesignTokenProps } from "../format/design-token-props";
import { Extensions } from "../format/extensions";

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


  public getType(): Type {
    const ownType = this.type;
    if (ownType === undefined) {
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

    return ownType;
  }

  public toJSON(): object {
    return {
      ...(super.toJSON()),

      value: this.value,
      extensions: this.extensions,
    }
  }
}
