import DeferredReference from './deferred-reference';

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

  setRefValue(ref) {
    if (this._refCheckFn(ref)) {
      this._reference = ref;
      this._value = undefined;
    } else {
      throw new TypeError(`"${ref}" is not a valid value reference for property ${this._propName}.`);
    }
  }

  setValue(value) {
    if (value instanceof DeferredReference) {
      // Register self with def ref object, so that it can later
      // call setRefValue() once the referenced token exists.
      value.setProperty(this);
      this._value = null; // temporary dummy value
      this._reference = undefined;
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
