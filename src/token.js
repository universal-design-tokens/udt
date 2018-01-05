
class Token {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }


  get handle() {
    if (this._customHandle !== undefined) {
      return this._customHandle;
    }
    return this.name;
  }

  set handle(customHandle) {
    if (typeof customHandle !== 'string') {
      throw new TypeError('Token handle is not a string.');
    }
    this._customHandle = customHandle;
  }


  get name() {
    return this._name;
  }

  set name(name) {
    if (name === undefined) {
      throw new Error('Token name is undefined');
    } else if (typeof name !== 'string') {
      throw new TypeError('Token name is not a string.');
    }
    this._name = name;
  }


  get value() {
    return this._value;
  }

  set value(value) {
    if (value === undefined) {
      throw new Error('Token value is undefined');
    }
    this._checkValueType(value); // should throw error for invalid types
    this._value = value;
  }

  /* eslint-disable class-methods-use-this */
  _checkValueType() {}
  /* eslint-enable class-methods-use-this */
}

export default Token;
