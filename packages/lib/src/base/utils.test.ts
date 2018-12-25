import * as utils from './utils';

const propName = 'testProp';
const value = 42;

describe('addPrivateProp()', () => {
  test('a private prop\'s value can be retrieved', () => {
    const obj: any = {};
    utils.addPrivateProp(obj, propName, value);
    expect(obj[propName]).toBe(value);
  });

  test('a private prop cannot be deleted', () => {
    const obj: any = {};
    utils.addPrivateProp(obj, propName, value);
    expect(() => {
      delete obj[propName];
    }).toThrow(TypeError);
  });

  test('a private prop cannot be enumerated', () => {
    const obj = {};
    utils.addPrivateProp(obj, propName, value);
    expect(Object.keys(obj)).not.toContain(propName);
  });
});

const mockGetter = jest.fn().mockReturnValue(value);
const mockSetter = jest.fn();

describe('addPublicProp()', () => {
  test('reading a public prop calls its getter function', () => {
    const obj: any = {};
    utils.addPublicProp(obj, propName, mockGetter, mockSetter);
    expect(obj[propName]).toBe(value);
    expect(mockGetter.mock.calls.length).toBe(1);
  });

  test('writing a public prop calls its setter function', () => {
    const obj: any = {};
    utils.addPublicProp(obj, propName, mockGetter, mockSetter);
    obj[propName] = value;
    expect(mockSetter.mock.calls.length).toBe(1);
  });

  test('a public prop cannot be deleted', () => {
    const obj: any = {};
    utils.addPublicProp(obj, propName, mockGetter, mockSetter);
    expect(() => {
      delete obj[propName];
    }).toThrow(TypeError);
  });

  test('a public prop can be enumerated', () => {
    const obj = {};
    utils.addPublicProp(obj, propName, mockGetter, mockSetter);
    expect(Object.keys(obj)).toContain(propName);
  });
});
