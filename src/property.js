import Token from './token';

function checkIsToken(value) {
  return value instanceof Token;
}

function acceptAll() {
  return true;
}

class Property {
  constructor(propName, valueCheckerFn = acceptAll, refCheckFn = acceptAll) {
    this._propName = propName;
    this._valueCheckerFn = valueCheckerFn;
    this._refCheckFn = refCheckFn;
  }

  isReferencedValue() {
    if (this._reference !== undefined) {
      return true;
    }
    return false;
  }

  setValue(value) {
    // Passing in a Token type results in a reference to the
    // corresponding property of that token.
    if (checkIsToken(value)) {
      if (this._refCheckFn(value)) {
        this._reference = value;
        this._value = undefined;
      } else {
        throw new TypeError(`Cannot reference token "${value}" for property ${this._propName}.`);
      }
    // Any non-Token type is stored as a value
    } else if (this._valueCheckerFn(value)) {
      this._value = value;
      this._reference = undefined;
    } else {
      throw new TypeError(`"${value}" is not a valid value for property ${this._propName}.`);
    }
  }

  getValue() {
    if (this.isReferencedValue()) {
      return this._reference[this._propName];
    }
    return this._value;
  }

  getReference() {
    return this._reference;
  }
}

export default Property;
