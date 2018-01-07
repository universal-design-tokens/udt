
import Property from './property';

function isValidName(name) {
  return (typeof name === 'string') && (name.length > 0);
}

function isString(value) {
  return typeof value === 'string';
}

function addPrivateProp(obj, propName, value) {
  Object.defineProperty(
    obj,
    propName,
    {
      enumerable: false,
      configurable: false,
      writable: true,
      value,
    },
  );
}

function addPublicProp(obj, propName, getterFn, setterFn) {
  Object.defineProperty(
    obj,
    propName,
    {
      enumerable: true,
      configurable: false,
      get: getterFn,
      set: setterFn,
    },
  );
}

function addTokenProp(token, name, valueCheckerFn, refCheckFn) {
  // eslint-disable-next-line no-param-reassign
  token._props[name] = new Property(name, valueCheckerFn, refCheckFn);
  addPublicProp(
    token,
    name,
    () => token._props[name].getValue(),
    (value) => {
      token._props[name].setValue(value);
    },
  );
}


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
      'name',
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
      'handle',
      () => {
        if (this._customHandle !== undefined) {
          return this._customHandle;
        }
        return this.name;
      },
      (customHandle) => {
        if (!isValidName(customHandle)) {
          throw new TypeError(`"${customHandle}" is not a valid Token custom handle.`);
        }
        this._customHandle = customHandle;
      },
    );

    // Standard "description" property that is common to all Token
    // types.
    addTokenProp(this, 'description', isString);
  }
}

export default Token;
export { addTokenProp };
