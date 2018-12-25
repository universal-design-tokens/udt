/**
 * Adds or configures an property of an object to be non-enumerable and
 * non-configurable.
 *
 * This essentially makes it "invisible" from functions that enumerate or iterate
 * over an object's properties.
 *
 * @param obj       The object to add the property to (or whose property to configure
 *                  if it already has a property with the same name).
 * @param propName  The name of the property to add or configure.
 * @param value     Optional value to assign to this property.
 */
export function addPrivateProp(obj: any, propName: string, value?: any) {
  Object.defineProperty(
    obj,
    propName,
    {
      enumerable: false,
      configurable: false,
      writable: true,
      value: value,
    },
  );
}

/**
 * Adds or configures an property of an object to be enumerable,
 * non-configurable and have custom getter and setter functions.
 *
 * Note that property getters/setters declared on ES5 classes are not
 * enumerable. Therefore, even for classes, it can be useful to use
 * this utility function if you need such properties to be enumerable.
 *
 * @param obj       The object to add the property to (or whose property to configure
 *                  if it already has a property with the same name).
 * @param propName  The name of the property to add or configure.
 * @param getterFn  The getter function that receives any values assigned to this property.
 * @param setterFn  The setter function that returns values when this property is read.
 */
export function addPublicProp<T>(obj: any, propName: string, getterFn: () => T, setterFn: (val: T) => void) {
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
