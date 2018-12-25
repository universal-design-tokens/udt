import Property from './property';

class MockObject {
  prop: Property<number, MockObject>;

  static getProp(mockObj: MockObject) {
    return mockObj.prop;
  }

  constructor() {
    this.prop = new Property(MockObject.getProp);
  };
}

describe('Property', () => {
  const testVal = 42;
  const testVal2 = 666;
  let prop: Property<number, MockObject>;

  beforeEach(() => {
    prop = new Property(MockObject.getProp);
  });

  test('has a default value of undefined', () => {
    expect(prop.getValue()).toBeUndefined();
  });

  test('does not reference a value by default', () => {
    expect(prop.isReference()).toBe(false);
  });

  test('setValue() can set a value', () => {
    prop.setValue(testVal);
    expect(prop.getValue()).toBe(testVal);
  });

  test('setValue() can set an undefined value', () => {
    prop.setValue();
    expect(prop.getValue()).toBeUndefined();
  });

  test('references() returns false for property that does not reference an object', () => {
    const otherObj = new MockObject();
    expect(prop.references(otherObj)).toBe(false);
  });

  test('isReference() returns true when a referenced object has been set via setReference()', () => {
    const obj = new MockObject();
    prop.setReference(obj);
    expect(prop.isReference()).toBe(true);
  });

  test('getReference() returns the referenced object that has been set via setReference()', () => {
    const obj = new MockObject();
    prop.setReference(obj);
    expect(prop.getReference()).toBe(obj);
  });

  test('setReference() throws an Error if setting a reference itself', () => {
    const obj = new MockObject();
    obj.prop = prop;
    expect(() => {prop.setReference(obj);}).toThrow(Error);
  });


  describe('referencing an object', () => {
    let obj: MockObject;

    beforeEach(() => {
      obj = new MockObject();
      obj.prop.setValue(testVal2);
      prop.setReference(obj);
    });

    test('getValue() returns referenced object\'s property\'s value', () => {
      expect(prop.getValue()).toBe(testVal2);
    });

    test('getValue() returns referenced object\'s property\'s value, even when it changes', () => {
      obj.prop.setValue(testVal);
      expect(prop.getValue()).toBe(testVal);
    });

    test('refences() returns true for directly referenced property', () => {
      expect(prop.references(obj)).toBe(true);
    });
  });


  describe('with reference chain', () => {
    let firstObj: MockObject;
    let middleObj: MockObject;
    let lastObj: MockObject;

    beforeEach(() => {
      firstObj = new MockObject();
      middleObj = new MockObject();
      lastObj = new MockObject();

      prop.setReference(firstObj);
      firstObj.prop.setReference(middleObj);
      middleObj.prop.setReference(lastObj);
      lastObj.prop.setValue(testVal);
    });

    test('getValue() returns last object\'s property\'s value', () => {
      expect(prop.getValue()).toBe(testVal);
    });

    test('getValue() returns last object\'s property\'s value, even when it changes', () => {
      lastObj.prop.setValue(testVal2);
      expect(prop.getValue()).toBe(testVal2);
    });

    test('refences() returns true for intermediate referenced object', () => {
      expect(prop.references(middleObj)).toBe(true);
    });

    test('refences() returns true for last referenced object', () => {
      expect(prop.references(lastObj)).toBe(true);
    });

    test('setReference() throws an Error if setting cyclical reference', () => {
      expect(() => {lastObj.prop.setReference(firstObj);}).toThrow(Error);
    });
  });
});
