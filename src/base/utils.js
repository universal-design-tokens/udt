export function addPrivateProp(obj, propName, value) {
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

export function addPublicProp(obj, propName, getterFn, setterFn) {
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
