import { TOMNode, TOMNodeCommonProps } from "./tom-node";
import { NodeWithParent } from "./node-with-parent";
import { Type } from "./type";
import { Value, CompositeValue, JsonValue, identifyJsonType, UNSUPPORTED_TYPE } from "./values";
import { Reference, isReference } from "./reference";
import { resolveReference } from "./referencable-property";
import { isCompositeValue } from "./values/composite-value";
import { ReferencedValueResolver } from "./interfaces/referenced-value-resolver";

export type TokenValue = Value | CompositeValue | JsonValue;

export type DeferredValue = (ownOrInheritedType?: Type) => TokenValue | Reference;

export function isDesignToken(node: unknown): node is DesignToken {
  return node instanceof DesignToken;
}

function tokenToReference<V extends TokenValue | DeferredValue>(tokenOrOther: DesignToken | Reference | V): Reference | V {
  return isDesignToken(tokenOrOther) ? tokenOrOther.getReference() : tokenOrOther;
}

export class DesignToken extends TOMNode implements ReferencedValueResolver {
  #valueOrReference: TokenValue | Reference | DeferredValue;
  #extensions: Map<string, JsonValue>;

  /**
   * Constructs a new design token node.
   */
  constructor(
    name: string,
    valueOrReferenceOrToken: TokenValue | Reference | DeferredValue | DesignToken,
    commonProps: TOMNodeCommonProps = {}
  ) {
    super(name, commonProps);

    this.#valueOrReference = tokenToReference(valueOrReferenceOrToken);
    if (isCompositeValue(valueOrReferenceOrToken)) {
      NodeWithParent._assignParent(valueOrReferenceOrToken, this);
    }


    this.#extensions = new Map<string, JsonValue>();
  }

  public isAlias(): boolean {
    return isReference(this.#valueOrReference);
  }

  private static __getTokenValue(node: TOMNode): TokenValue | Reference {
    if (node instanceof DesignToken) {
      return node.getValue();
    }
    throw new Error(`Node "${node.getName()}" is not a design token`);
  }

  public resolveReferencedValue(reference: Reference): TokenValue {
    return resolveReference(reference, this, DesignToken.__getTokenValue);
  }

  public getReference(): Reference {
    return new Reference(this.getPath());
  }

  /**
   * Retrieves the token value.
   *
   * @param resolve
   */
  public getValue(resolve: true): TokenValue;
  public getValue(resolve?: boolean): TokenValue | Reference;
  public getValue(resolve: boolean = false): TokenValue | Reference {
    if (typeof this.#valueOrReference === 'function') {
      throw new Error(`Token "${this.getName()}" has pending value`);
    }
    const valueOrReference = this.#valueOrReference;
    if (resolve && isReference(valueOrReference)) {
      return this.resolveReferencedValue(valueOrReference);
    }
    return valueOrReference;
  }


  public setValue(valueOrReferenceOrToken: TokenValue | Reference | DesignToken): void {
    // While assigning a parent for the first time, we may still have a deferred value
    // which would cause getValue() to throw an error, so we need to guard against that.
    const oldValue = typeof this.#valueOrReference === 'function' ? undefined : this.getValue();
    this.#valueOrReference = tokenToReference(valueOrReferenceOrToken);
    if (isCompositeValue(valueOrReferenceOrToken)) {
      NodeWithParent._assignParent(valueOrReferenceOrToken, this);
    }
    if (oldValue !== undefined && isCompositeValue(oldValue)) {
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
      if (inferredJsonType === UNSUPPORTED_TYPE) {
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
    if (typeof this.#valueOrReference === "function") {
      this.setValue(this.#valueOrReference(this.__getOwnOrInheritedType()));
    }
  };
}


const tmp = new DesignToken('test', 123);

const foo = tokenToReference(tmp);
