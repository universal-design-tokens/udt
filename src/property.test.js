import Property from './property';
import Token from './token';

const propName = 'testProp';
const testVal = 'testVal';

class TestToken extends Token {
  constructor(name, propVal) {
    super(name);
    this[propName] = propVal;
  }
}

const testTokenVal = 'testTokenVal';
const testToken = new TestToken('test token', testTokenVal);

describe('Basic Property with no custom checkers', () => {
  const prop = new Property(propName);

  test('a new Property has an undefined value', () => {
    expect(prop.getValue()).toBeUndefined();
  });

  test('a new Property has an undefined reference', () => {
    expect(prop.getReference()).toBeUndefined();
  });

  test('a new Property does not have a referenced value', () => {
    expect(prop.isReferencedValue()).toBe(false);
  });

  test('a value that was set can be retrieved', () => {
    prop.setValue(testVal);
    expect(prop.getValue()).toBe(testVal);
  });

  test('a Property with a value set does not have a reference value', () => {
    prop.setValue(testVal);
    expect(prop.isReferencedValue()).toBe(false);
  });

  test('setting an undefined value works', () => {
    prop.setValue(undefined);
    expect(prop.getValue()).toBeUndefined();
    expect(prop.isReferencedValue()).toBe(false);
  });

  test('setting a Token object as a value makes a reference value', () => {
    prop.setValue(testToken);
    expect(prop.isReferencedValue()).toBe(true);
  });

  test('a reference value that was set can be retrieved', () => {
    prop.setValue(testToken);
    expect(prop.getValue()).toBe(testTokenVal);
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


function isTestToken(value) {
  return value instanceof TestToken;
}

class OtherTestToken extends Token {}

const otherTestToken = new OtherTestToken('test token');

describe('Property with custom reference checker', () => {
  const prop = new Property(propName, isTestValText, isTestToken);

  test('setting a valid reference value works', () => {
    prop.setValue(testToken);
    expect(prop.getValue()).toBe(testTokenVal);
  });

  test('setting an invalid reference value throws a TypeError', () => {
    expect(() => {
      prop.setValue(otherTestToken);
    }).toThrow(TypeError);
  });
});
