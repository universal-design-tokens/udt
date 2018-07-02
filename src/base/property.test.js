import Property from './property';
import DeferredReference from './deferred-reference';
import { idToReference } from './reference-utils';

const propName = 'testProp';
const testVal = 'testVal';

const refVal = 'refVal';
const refObj = {};
refObj[propName] = refVal;

describe('Basic Property with no custom checkers', () => {
  const prop = new Property(propName);

  test('initial value is undefined', () => {
    expect(prop.getValue()).toBeUndefined();
  });

  test('initial reference object is undefined', () => {
    expect(prop.getReference()).toBeUndefined();
  });

  test('does not reference a value initially', () => {
    expect(prop.isReferencedValue()).toBe(false);
  });

  test('setting a value works', () => {
    prop.setValue(testVal);
    expect(prop.getValue()).toBe(testVal);
  });

  test('setting a value make isReferencedValue() return false', () => {
    prop.setValue(testVal);
    expect(prop.isReferencedValue()).toBe(false);
  });

  test('setting an undefined value works', () => {
    prop.setValue(undefined);
    expect(prop.getValue()).toBeUndefined();
  });

  test('setting a referenced value make isReferencedValue() return true', () => {
    prop.setRefValue(refObj);
    expect(prop.isReferencedValue()).toBe(true);
  });

  test('setting a referenced value works', () => {
    prop.setRefValue(refObj);
    expect(prop.getValue()).toBe(refVal);
  });

  test('setting a deferred reference works', () => {
    const refString = idToReference('foo');
    const defRef = new DeferredReference(refString);
    prop.setValue(defRef);

    expect(prop.getValue()).toBeNull();
    expect(prop.isReferencedValue()).toBe(false);
    expect(defRef.prop).toBe(prop);
  });
});


function isTestValText(value) {
  return value === testVal;
}

describe('Property with custom value checker', () => {
  const prop = new Property(propName, isTestValText);

  test('setting a valid value works', () => {
    prop.setValue(testVal);
    expect(prop.getValue()).toBe(testVal);
  });

  test('setting an invalid value throws a TypeError', () => {
    const invalidValue = 42;
    expect(() => {
      prop.setValue(invalidValue);
    }).toThrow(TypeError);
  });
});


function isOriginalRefObj(value) {
  return value === refObj;
}

const otherRefObj = {};

describe('Property with custom reference checker', () => {
  const prop = new Property(propName, isTestValText, isOriginalRefObj);

  test('setting a valid reference value works', () => {
    prop.setRefValue(refObj);
    expect(prop.getValue()).toBe(refVal);
  });

  test('setting an invalid reference value throws a TypeError', () => {
    expect(() => {
      prop.setRefValue(otherRefObj);
    }).toThrow(TypeError);
  });
});
