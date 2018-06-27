
import Property from './property';
import { addPrivateProp, addPublicProp } from './utils';
import { idToReference, escapeStringValue } from './reference-utils';
import { UdtParseError } from './errors';

const idRegex = /^\w[-_\w\d]*$/;

function isValidId(id) {
  return (typeof id === 'string') && idRegex.test(id);
}

function isValidName(name) {
  return (typeof name === 'string') && (name.length > 0);
}

function isValidDescription(value) {
  return value === undefined || typeof value === 'string';
}

const nameProp = 'name';
const idProp = 'id';

class Token {
  constructor(data) {
    if (typeof data !== 'object' || Array.isArray(data)) {
      throw new UdtParseError('Cannot parse token from non-object.');
    }

    const {
      id,
      name = undefined,
      description = undefined,
      ...rest
    } = data;

    if (Object.keys(rest).length > 0) {
      throw new UdtParseError(`Unexpected properties in input data: ${Object.keys(rest).join(', ')}`);
    }

    // Non-enumerable "_props" member
    // for storing Property objects
    addPrivateProp(this, '_props', {});

    // Enumerable "name" prop with get & set
    // function to validate names.
    addPrivateProp(this, '_id', undefined);
    addPublicProp(
      this,
      idProp,
      () => this._id,
      (newId) => {
        if (!isValidId(newId)) {
          throw new TypeError(`"${newId}" is not a valid Token ID.`);
        }
        this._id = newId;
      },
    );
    this.id = id;

    // Enumerable "name" prop for setting custom display name
    // that take precedence over ID
    addPrivateProp(this, '_customName', undefined);
    addPublicProp(
      this,
      nameProp,
      () => {
        if (this._customName !== undefined) {
          return this._customName;
        }
        return this.id;
      },
      (newName) => {
        if (newName !== undefined && !isValidName(newName)) {
          throw new TypeError(`"${newName}" is not a valid Token name.`);
        }
        this._customName = newName;
      },
    );
    this.name = name;

    // Standard "description" property that is common to all Token
    // types.
    this._addTokenProp('description', isValidDescription);
    this.description = description;
  }

  static isToken(token) {
    return token instanceof Token;
  }

  _addTokenProp(propName, valueCheckerFn, refCheckFn) {
    this._props[propName] = new Property(propName, valueCheckerFn, refCheckFn);
    addPublicProp(
      this,
      propName,
      () => this._props[propName].getValue(),
      (value) => {
        if (!Token.isToken(value)) {
          this._props[propName].setValue(value);
        } else {
          if (value === this || value.referencesToken(propName, this)) {
            throw new Error(`Cyclical value reference detected for "${value}".`);
          }
          this._props[propName].setRefValue(value);
        }
      },
    );
  }

  isReferencedValue(propName) {
    return this._props[propName].isReferencedValue();
  }

  getReferencedToken(propName) {
    return this._props[propName].getReference();
  }

  referencesToken(propName, token) {
    if (this.isReferencedValue(propName)) {
      const refToken = this.getReferencedToken(propName);
      if (refToken === token) {
        return true;
      }
      return refToken.referencesToken(propName, token);
    }
    return false;
  }

  toReference() {
    return idToReference(this.id);
  }

  toJSON() {
    const output = {};
    Object.keys(this).forEach((propName) => {
      // Must check for .id or .name first, since neither is stored
      // in this._props and therefore calling isReferencedValue() with
      // those prop names would throw an error
      if (propName === idProp) {
        output[propName] = this[propName];
        return;
      }
      if (propName === nameProp) {
        if (this._customName !== undefined) {
          output[propName] = this[propName];
        }
        return;
      }

      let value;
      if (this.isReferencedValue(propName)) {
        output[propName] = this.getReferencedToken(propName).toReference();
      } else {
        value = this[propName];
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

export default Token;
