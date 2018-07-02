import DeferredReference from './deferred-reference';
import { idToReference } from './reference-utils';

describe('Deferred reference', () => {
  const ref = idToReference('foo');

  test('construct', () => {
    const defRef = new DeferredReference(ref);
    expect(defRef.refString).toBe(ref);
    expect(defRef.prop).toBeUndefined();
  });

  test('setting property', () => {
    const mockProp = {};
    const defRef = new DeferredReference(ref);
    defRef.setProperty(mockProp);
    expect(defRef.prop).toBe(mockProp);
  });

  test('resolving reference', () => {
    const mockProp = {};
    const mockToken = {};
    const defRef = new DeferredReference(ref);
    const mockFn = jest.fn();
    mockProp.setRefValue = mockFn;
    defRef.setProperty(mockProp);
    defRef.resolveReference(mockToken);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.calls[0][0]).toBe(mockToken);
  });
});
