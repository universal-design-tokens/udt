import DeferredReference from './deferred-reference';
import Referencer from './referencer';

const refString = 'foo';

describe('Deferred reference', () => {
  let defRef: DeferredReference<any>;

  beforeEach(() => {
    defRef = new DeferredReference(refString);
  });

  test('construct', () => {
    expect(defRef.refString).toBe(refString);
  });

  test('resolving reference', () => {
    const mockSetReferenceFn = jest.fn();
    const referencer: Referencer<any> = {
      setReference: mockSetReferenceFn
    };

    const refObj = {};

    const defRef = new DeferredReference(refString);
    defRef.prop = referencer;
    defRef.resolveReference(refObj);
    expect(mockSetReferenceFn).toHaveBeenCalledWith(refObj);
  });

  test('resolving without a referencer being set throws an Error', () => {
    const defRef = new DeferredReference(refString);
    expect(() => { defRef.resolveReference({}); }).toThrow(Error);
  });
});
