import { TOMNode, TOMNodeCommonProps } from "./tom-node";
import { NodeWithParent } from "./node-with-parent";
import { Type } from "./type";
import { Value, JsonValue, identifyJsonType, NOT_JSON } from "./values";
import { Reference, isReference } from "./reference";
import { resolveReference } from "./referencable-property";
import { isCompositeValue } from "./values/composite-value";
import { ReferencedValueResolver } from "./interfaces/referenced-value-resolver";

export type DeferredValue = (ownOrInheritedType?: Type) => Value | Reference;

export class DesignToken extends TOMNode implements ReferencedValueResolver {
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

    this.#value = value;
    if (isCompositeValue(value)) {
      NodeWithParent._assignParent(value, this);
    }


    this.#extensions = new Map<string, JsonValue>();
  }

  public isAlias(): boolean {
    return isReference(this.#value);
  }

  private static __getTokenValue(node: TOMNode): Value | Reference {
    if (node instanceof DesignToken) {
      return node.getValue();
    }
    throw new Error(`Node "${node.getName()}" is not a design token`);
  }

  public resolveReferencedValue(reference: Reference): Value {
    return resolveReference(reference, this, DesignToken.__getTokenValue);
  }

  public getResolvedValue(): Value {
    const valueOrReference = this.getValue()
    if (isReference(valueOrReference)) {
      return this.resolveReferencedValue(valueOrReference);
    }
    return valueOrReference;
  }

  public getValue(): Value | Reference {
    if (typeof this.#value === 'function') {
      throw new Error(`Token "${this.getName()}" has pending value`);
    }
    return this.#value;
  }

  public setValue(value: Value | Reference): void {
    const oldValue = this.#value;
    this.#value = value;
    if (isCompositeValue(value)) {
      NodeWithParent._assignParent(value, this);
    }
    if (isCompositeValue(oldValue)) {
      NodeWithParent._clearParent(oldValue);
    }
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


  private static __getTokenType(node: TOMNode): Type {
    if (node instanceof DesignToken) {
      return node.getResolvedType();
    }
    throw new Error(`Node "${node.getName()}" is not a design token`);
  }

  public getResolvedType(): Type {
    let type = this.getType();
    if (type === undefined) {
      // Is value a reference?
      const valueOrReference = this.getValue();
      if (isReference(valueOrReference)) {
        return resolveReference(valueOrReference, this, DesignToken.__getTokenType);
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
      this.setValue(this.#value(this.__getOwnOrInheritedType()));
    }
  };
}
