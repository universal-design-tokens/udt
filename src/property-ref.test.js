import PropertyRef from './property-ref';

const key = 'testKey';
const val = 'testVal';

const originalObject = {};
originalObject[key] = val;

const ref = new PropertyRef(originalObject, key);

test('value of referenced property can be retrieved', () => {
  expect(ref.getValue()).toBe(val);
});

test('changes to value of referenced property can be retrieved', () => {
  const newVal = 42;
  originalObject[key] = newVal;
  expect(ref.getValue()).toBe(newVal);
});

