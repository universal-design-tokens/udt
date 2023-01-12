import { TOMNode, TOMNodeCommonConstructorProps } from "./tom-node";
import { NodeWithParent } from "./node-with-parent";
import { Type } from "./type";
import {
  Value,
  CompositeValue,
  UNSUPPORTED_TYPE,
  identifyType,
} from "./values";
import { Reference, isReference } from "./reference";
import { resolveReference } from "./resolve-reference";
import { isCompositeValue } from "./values/composite-value";
import { ReferencedValueResolver } from "./interfaces/referenced-value-resolver";

export const enum SetValueStrategy {
  /**
   * Only accept the new value or reference if it is compatible with
   * the token's resolved type. Throw an error otherwise.
   *
   */
  REJECT_INCOMPATIBLE,

  /**
   * Always the new value or reference and, if it is incompatible with
   * the token's resolved type, set the token's own type so that it
   * matches that of the (referenced) value.
   */
  UPDATE_TYPE,
}

export type TokenValue = Value | CompositeValue | number;

export type DeferredValue = (ownOrInheritedType: Type) => TokenValue;

export type DeferredValueOrReference = () => Reference | DeferredValue;

export function isDesignToken(node: unknown): node is DesignToken {
  return node instanceof DesignToken;
}

function tokenToReference<V extends TokenValue | DeferredValueOrReference>(
  tokenOrOther: DesignToken | Reference | V
): Reference | V {
  return isDesignToken(tokenOrOther)
    ? tokenOrOther.getReference()
    : tokenOrOther;
}

export class DesignToken extends TOMNode implements ReferencedValueResolver {
  #valueOrReference: TokenValue | Reference | DeferredValueOrReference;

  /**
   * Constructs a new design token node.
   */
  constructor(
    name: string,
    valueOrReferenceOrToken:
      | TokenValue
      | Reference
      | DeferredValueOrReference
      | DesignToken,
    commonProps: TOMNodeCommonConstructorProps = {},
    strategy: SetValueStrategy = SetValueStrategy.UPDATE_TYPE
  ) {
    super(name, commonProps);

    const newValueOrReference = tokenToReference(valueOrReferenceOrToken);
    if (typeof newValueOrReference !== "function") {
      this.__applySetValueStrategy(
        newValueOrReference,
        this.getType(),
        strategy
      );
    }

    this.#valueOrReference = newValueOrReference;
    if (isCompositeValue(valueOrReferenceOrToken)) {
      NodeWithParent._assignParent(valueOrReferenceOrToken, this);
    }
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

  private static __getTokenByReference(
    node: TOMNode,
    reference: Reference
  ): TOMNode | undefined {
    return node.getTopParent()?.getReferencedNode(reference);
  }

  public resolveReferencedValue(reference: Reference): TokenValue {
    return resolveReference(
      reference,
      this,
      DesignToken.__getTokenByReference,
      DesignToken.__getTokenValue
    );
  }

  /**
   * Retrieves the token value.
   *
   * @param resolve
   */
  public getValue(resolve: true): TokenValue;
  public getValue(resolve?: boolean): TokenValue | Reference;
  public getValue(resolve: boolean = false): TokenValue | Reference {
    if (typeof this.#valueOrReference === "function") {
      throw new Error(`Token "${this.getName()}" has pending value`);
    }
    const valueOrReference = this.#valueOrReference;
    if (resolve && isReference(valueOrReference)) {
      return this.resolveReferencedValue(valueOrReference);
    }
    return valueOrReference;
  }

  private __doSetValue(valueOrReference: TokenValue | Reference): void {
    // While assigning a parent for the first time, we may still have a deferred value
    // which would cause getValue() to throw an error, so we need to guard against that.
    const oldValue =
      typeof this.#valueOrReference === "function"
        ? undefined
        : this.getValue();
    this.#valueOrReference = valueOrReference;
    if (isCompositeValue(valueOrReference)) {
      NodeWithParent._assignParent(valueOrReference, this);
    }
    if (oldValue !== undefined && isCompositeValue(oldValue)) {
      NodeWithParent._clearParent(oldValue);
    }
  }

  private __applySetValueStrategy(
    valueOrReference: Reference | TokenValue,
    currentType: Type | undefined,
    strategy: SetValueStrategy
  ): void {
    const newValueType = isReference(valueOrReference)
      ? resolveReference(
          valueOrReference,
          this,
          DesignToken.__getTokenByReference,
          DesignToken.__getTokenType
        )
      : identifyType(valueOrReference);

    if (newValueType === UNSUPPORTED_TYPE) {
      throw new Error(
        `Cannot set token value as it has an unsupported type: ${newValueType}`
      );
    }

    if (currentType !== newValueType) {
      if (strategy === SetValueStrategy.REJECT_INCOMPATIBLE) {
        throw new Error(
          `New token value's type (${newValueType}) does not match token's type: ${currentType}`
        );
      } else {
        // strategy is update type
        this.setType(newValueType);
      }
    }
  }

  public setValue(
    valueOrReferenceOrToken: TokenValue | Reference | DesignToken,
    strategy: SetValueStrategy = SetValueStrategy.UPDATE_TYPE
  ): void {
    const newValueOrReference = tokenToReference(valueOrReferenceOrToken);
    this.__applySetValueStrategy(
      newValueOrReference,
      this.getResolvedType(),
      strategy
    );
    this.__doSetValue(newValueOrReference);
  }

  private __getOwnOrInheritedType(): Type {
    let type = this.getType();
    if (type === undefined) {
      // Are we inheriting a type from parent group(s)
      if (
        this.hasParent() &&
        (type = this.getParent()!.getInheritedType()) !== undefined
      ) {
        return type;
      }
    } else {
      return type;
    }
    throw new Error(
      `No own or inherited type found for design token "${this.getName()}"`
    );
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
        return resolveReference(
          valueOrReference,
          this,
          DesignToken.__getTokenByReference,
          DesignToken.__getTokenType
        );
      }

      // Are we inheriting a type from parent group(s)
      if (
        this.hasParent() &&
        (type = this.getParent()!.getInheritedType()) !== undefined
      ) {
        return type;
      }

      throw new Error(
        `Type for token ${this.getName()} cannot be resolved (no own type, no reference and no inherited type)`
      );
    }
    return type;
  }

  public isValid(): boolean {
    const valueType = identifyType(this.getValue(true));
    return valueType === this.getResolvedType();
  }

  protected _onParentAssigned(): void {
    if (typeof this.#valueOrReference === "function") {
      const deferredValueOrReference = this.#valueOrReference();

      this.__doSetValue(
        typeof deferredValueOrReference === "function"
          ? deferredValueOrReference(this.__getOwnOrInheritedType())
          : deferredValueOrReference
      );
    }
  }
}
