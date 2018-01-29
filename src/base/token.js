
import Property from './property';
import { addPrivateProp, addPublicProp } from './utils';

function isValidName(name) {
  return (typeof name === 'string') && (name.length > 0);
}

function isValidDescription(value) {
  return value === undefined || typeof value === 'string';
}

const nameProp = 'name';
const handleProp = 'handle';

class Token {
  constructor(name) {
    // Non-enumerable "_props" member
    // for storing Property objects
    addPrivateProp(this, '_props', {});

    // Enumerable "name" prop with get & set
    // function to validate names.
    addPrivateProp(this, '_name', undefined);
    addPublicProp(
      this,
      nameProp,
      () => this._name,
      (n) => {
        if (!isValidName(n)) {
          throw new TypeError(`"${n}" is not a valid Token name.`);
        }
        this._name = n;
      },
    );
    this.name = name;

    // Enumerable "handle" prop for setting custom handle
    // that take precedence over name
    addPrivateProp(this, '_customHandle', undefined);
    addPublicProp(
      this,
      handleProp,
      () => {
        if (this._customHandle !== undefined) {
          return this._customHandle;
        }
        return this.name;
      },
      (customHandle) => {
        if (customHandle !== undefined && !isValidName(customHandle)) {
          throw new TypeError(`"${customHandle}" is not a valid Token custom handle.`);
        }
        this._customHandle = customHandle;
      },
    );

    // Standard "description" property that is common to all Token
    // types.
    this._addTokenProp('description', isValidDescription);
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

  toJSON() {
    const output = {};
    Object.keys(this).forEach((propName) => {
      // Must check for .name or .handle first, since neither is stored
      // in this._props and therefore calling isReferencedValue() with
      // those prop names would throw an error
      if (propName === nameProp) {
        output[propName] = this[propName];
        return;
      }
      if (propName === handleProp) {
        if (this._customHandle !== undefined) {
          output[propName] = this[propName];
        }
        return;
      }

      let value;
      if (this.isReferencedValue(propName)) {
        output[propName] = '@foobar';
      } else {
        value = this[propName];
        if (value !== undefined) {
          output[propName] = value;
        }
      }
    });
    return output;
  }
}

export default Token;
