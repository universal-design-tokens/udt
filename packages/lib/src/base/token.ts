import Property from './property';
import { addPrivateProp, addPublicProp } from './utils';
import { idToReference, escapeStringValue } from './reference-utils';
import { UdtParseError } from './errors';
import DeferredReference from './deferred-reference';

const idRegex = /^\w[-_\w\d]*$/;

/**
 * A callback function that checks if a value is of a valid
 * instance of certain type.
 *
 * @param val   The value to be checked.
 * @return      True if the value is valid, false otherwise.
 */
export type CheckerFn<V> = (val: any) => val is V;

/**
 * Type alias for the token's internal properties object.
 */
type InternalTokenProps<V, T> = {
  [propName: string]: Property<V, T>
};


/**
 * Checks if the input is a valid token ID.
 *
 * @param id  The id to check.
 */
function isValidId(id: any): id is string {
  return (typeof id === 'string') && idRegex.test(id);
}

/**
 * Checks if the input is a string that value and therefore a valid name.
 *
 * @param name The name to check.
 */
function isValidName(name: any): name is string {
  return (typeof name === 'string') && (name.length > 0);
}

/**
 * Checks if the input is a valid description value.
 *
 * Any string value is allowed. Additionally, undefined is a valid value
 * (setting a token's description to undefined clears that token's
 * description).
 *
 * @param description The description to check.
 */
function isValidDescription(description: any): description is string | undefined {
  return description === undefined || typeof description === 'string';
}

/**
 * The name of the Token class's `name` property.
 */
const namePropName = 'name';

/**
 * The name of the Token class's `id` property.
 */
const idPropName = 'id';

/**
 * The name of the Token class's "description" property.
 *
 * May be used with tokens' `isReferencedValue()` and
 * `getReferencedToken()` methods.
 */
export const descriptionPropName = 'description';

/**
 * Base class for all Token types.
 *
 * This class implements the properties that are common to all
 * token types (`id`, `name` & `description`).
 *
 * It also implements the logic for managing properties that can
 * reference other token's values. Token types extending this class
 * must use `__setupTokenProp()` to add their own properties.
 *
 * Finally, a `toJSON()` implementation is provided that will serialize
 * any derived token type to a JSON object that can be added to a
 * UDT file.
 */
export default class Token {
  private _id = '';
  private _name?: string;
  private _props: InternalTokenProps<any, Token>;

  /**
   * The token's ID.
   *
   * Token IDs must be unique within a UDT file.
   *
   * When (re-)setting a token's ID, checks will be performed
   * to ensure that it is a valid token ID. In the event that
   * it is not, a `TypeError` will be thrown.
   */
  public id: string;

  /**
   * The optional display name for this token.
   *
   * For convenience, if no `name` value was assigned, but you read
   * this property then the token's current `id` value will be returned.
   *
   * When (re-)setting a token's name, checks will be performed to
   * ensure that it is a string value. In the event that it is not,
   * a `TypeError` will be thrown.
   */
  public name?: string;

  /**
   * The optional description text for this token.
   *
   * This token's description may also reference another token's
   * description. To create such a reference, simply assign the other
   * token object to this `description` property.
   *
   * E.g.: `thisToken.description = otherToken;`
   *
   * Note that _reading_ this property will always return the actual
   * description _value_. In the above example, the referenced token's
   * description will be returned.
   *
   * An existing description can be cleared by setting the value
   * of this property to `undefined`.
   *
   * When (re-)setting a token's description, checks will be performed
   * to ensure that it is a string value, another `Token` instance or
   * `undefined`. In the event that it is neither, a `TypeError` will
   * be thrown.
   */
  public description?: string | Token | DeferredReference<Token>;

  /**
   * Constructs a token object from a JSON object.
   *
   * The data passed in must be an object with at least an
   * `id` property whose value is a valid token ID string. It
   * may also contain `name` and `description` properties, with
   * valid token name and description string values, respectively.
   *
   * If the data is not an object or contains any other properties
   * a `UdtParseError` will be thrown.
   *
   * @param jsonObj   An object with the `id` and optionally,
   *                  `name` and/or `description` of this
   *                  token.
   */
  constructor(jsonObj?: any) {
    if (typeof jsonObj !== 'object' || Array.isArray(jsonObj)) {
      throw new UdtParseError('Cannot parse token from non-object.');
    }

    const {
      id,
      name,
      description,
      ...rest
    } = jsonObj;

    if (Object.keys(rest).length > 0) {
      throw new UdtParseError(`Unexpected properties in input data: ${Object.keys(rest).join(', ')}`);
    }

    // Enumerable "id" prop with get & set
    // function to validate names.
    addPrivateProp(this, '_id');
    addPublicProp(
      this,
      idPropName,
      () => this._id,
      (newId) => {
        if (!isValidId(newId)) {
          throw new TypeError(`"${newId}" is not a valid Token ID.`);
        }
        this._id = newId;
      },
    );
    this.id = id;

    // Enumerable "name" prop for setting custom display name,
    // but returns the id as a fallback in case no name was set.
    addPrivateProp(this, '_name');
    addPublicProp(
      this,
      namePropName,
      () => {
        if (this._name !== undefined) {
          return this._name;
        }
        return this.id;
      },
      (newName) => {
        if (newName !== undefined && !isValidName(newName)) {
          throw new TypeError(`"${newName}" is not a valid Token name.`);
        }
        this._name = newName;
      },
    );
    this.name = name;

    // Internal object that holds all token properties.
    addPrivateProp(this, '_props');
    this._props = {};

    // Standard "description" property that is common to all Token
    // types.
    this._setupTokenProp(descriptionPropName, isValidDescription, Token.isToken);
    this.description = description;
  }

  /**
   * Checks if the input is an instance of the
   * `Token` class, or one of its sub-classes.
   *
   * @param token   The token to check.
   */
  static isToken(token: any): token is Token {
    return token instanceof Token;
  }

  /**
   * Adds or configures a property of this token that can hold either a
   * value or a reference to another token's value.
   *
   * @param propName        The name of the property to add.
   * @param valueCheckerFn  A function that checks if a value is permitted
   *                        for this property.
   * @param refCheckFn      A function that checks if a token instance is
   *                        permitted as a reference value for this property.
   */
  protected _setupTokenProp<V, T extends Token>(
    propName: string,
    valueCheckerFn: CheckerFn<V>,
    refCheckFn: CheckerFn<T>
  ) {
    // Create property object and add to internal list
    this._props[propName] = new Property<any, Token>(
      (referencedToken: Token) => {
        return referencedToken._props[propName];
      }
    );

    // Now add public property with intelligent getter and
    // setter
    addPublicProp(
      this,
      propName,
      (): V => this._props[propName].getValue() as V,
      (value: V | T | DeferredReference<T>) => {
        const prop = this._props[propName];
        if (value instanceof DeferredReference) {
          value.prop = prop;
        }
        else {
          if (refCheckFn(value)) {
            // Reference to another token
            prop.setReference(value);
          }
          else if (valueCheckerFn(value)) {
            prop.setValue(value);
          }
          else {
            throw new TypeError(`"${value}" is not a valid value or token reference for property ${propName}.`);
          }
        }
      },
    );
  }

  /**
   * Checks if the value of a certain token property is actually
   * a reference to another token's value.
   *
   * @param propName  The name of the token property to check.
   */
  isReferencedValue(propName: string) {
    const prop = this._props[propName];
    return prop !== undefined && prop.isReference();
  }

  /**
   * Retrieves the token being referenced by a certain token property.
   *
   * @param propName  The name of the token property, whose referenced
   *                  token should be retrieved.
   */
  getReferencedToken(propName: string) {
    if (!Object.keys(this._props).includes(propName)) {
      throw new RangeError(`"${propName}" is not a known referencable property of this token type.`);
    }

    const prop = this._props[propName];
    return prop.getReference();
  }

  /**
   * Returns the "@..." reference for this token.
   */
  toReference() {
    return idToReference(this.id);
  }

  /**
   * Returns a JSON object representation of this token.
   *
   * As long as sub-classes correctly use `_setupTokenProp()` when
   * adding their own properties, this method will work for them too.
   * Specialised token types should therefore not need to implement
   * their own `toJSON()` methods.
   */
  toJSON() {
    const output: any = {};
    Object.keys(this).forEach((propName) => {
      // Must check for .id or .name first, since neither is stored
      // in this._props and therefore calling isReferencedValue() with
      // those prop names would throw an error
      if (propName === idPropName) {
        output[propName] = this[propName];
        return;
      }
      if (propName === namePropName) {
        // Only inlude name in output if one was
        // actually set
        if (this._name !== undefined) {
          output[propName] = this[propName];
        }
        return;
      }

      // One of the other props that we internally store in
      // this._props
      const referencedToken = this.getReferencedToken(propName);
      if (referencedToken !== undefined) {
        // This prop's value is a token reference
        output[propName] = referencedToken.toReference();
      } else {
        // This prop has a normal value
        let value = (this as any)[propName];
        if (value !== undefined) {
          if (typeof value === 'string') {
            value = escapeStringValue(value);
          }
          output[propName] = value;
        }
      }
    });
    return output;
  }
}
