import Token from './token';
import { REFERENCE_PREFIX, ESCAPE_CHAR, escapeStringValue } from './reference-utils';
import { UdtParseError } from './errors';

const tokenId = 'testId';
const token = new Token({ id: tokenId });

describe('Core Token properties', () => {
  test('token\'s ID is accessible', () => {
    expect(token.id).toBe(tokenId);
  });

  test('token\'s name matches ID', () => {
    expect(token.name).toBe(tokenId);
  });

  test('token\'s name can be customised without altering ID', () => {
    const customName = 'customName';
    token.name = customName;
    expect(token.id).toBe(tokenId);
    expect(token.name).toBe(customName);
  });

  test('custom token name can be cleared by setting it to undefined', () => {
    // Set a custom handle
    const customName = 'customName';
    token.name = customName;
    // Now clear it
    token.name = undefined;
    // Without the custom handle, .handle should fall back to the .name
    expect(token.name).toBe(tokenId);
  });

  test('creating token without an ID throws a TypeError', () => {
    expect(() => new Token({})).toThrow(TypeError);
  });

  test('creating token with no args throws a UdtParseError', () => {
    expect(() => new Token()).toThrow(UdtParseError);
  });

  test('setting a non-string ID throws a TypeError', () => {
    expect(() => {
      token.id = 42;
    }).toThrow(TypeError);
  });

  test('setting an empty string ID throws a TypeError', () => {
    expect(() => {
      token.id = '';
    }).toThrow(TypeError);
  });

  test('setting an invalid ID throws a TypeError', () => {
    const invalidIds = [
      'id with spaces',
      //'1-id-starting-with-number',
      'id*with.invalid=chars',
    ];

    invalidIds.forEach((invalidId) => {
      expect(() => {
        new Token({ id: invalidId }); // eslint-disable-line no-new
      }).toThrow(TypeError);
    });
  });

  test('setting a non-string name throws a TypeError', () => {
    expect(() => {
      token.name = 42;
    }).toThrow(TypeError);
  });

  test('setting an empty string name throws a TypeError', () => {
    expect(() => {
      token.name = '';
    }).toThrow(TypeError);
  });
});


describe('Token description', () => {
  const tokenDescription = 'test description';
  const token2id = 'token2';
  const token2 = new Token({ id: token2id });
  const token3id = 'token3';
  const token3 = new Token({ id: token3id });

  test('token\'s description is accessible', () => {
    token.description = tokenDescription;
    expect(token.description).toBe(tokenDescription);
  });

  test('token\'s description is not a referenced value', () => {
    token.description = tokenDescription;
    expect(token.isReferencedValue('description')).toBe(false);
  });

  test('token\'s description\'s referenced token is undefined', () => {
    token.description = tokenDescription;
    expect(token.getReferencedToken('description')).toBeUndefined();
  });

  test('token\'s description can be cleared by setting it to undefined', () => {
    token.description = undefined;
    expect(token.description).toBeUndefined();
  });

  test('setting a non-string description throws a TypeError', () => {
    expect(() => {
      token.description = 42;
    }).toThrow(TypeError);
  });

  test('setting a non-string description throws a TypeError', () => {
    expect(() => {
      token.description = 42;
    }).toThrow(TypeError);
  });

  test('setting another token as the description references that token\'s description', () => {
    token.description = tokenDescription;
    token2.description = token;
    expect(token2.description).toBe(tokenDescription);
  });

  test('referenced value is identified as such', () => {
    token.description = tokenDescription;
    token2.description = token;
    expect(token2.isReferencedValue('description')).toBe(true);
  });

  test('getting referenced value\'s token', () => {
    token.description = tokenDescription;
    token2.description = token;
    expect(token2.getReferencedToken('description')).toBe(token);
  });

  test('checking if one token references another works', () => {
    token.description = tokenDescription;
    token2.description = token;
    expect(token2.referencesToken('description', token)).toBe(true);
  });

  test('following a chain of references works', () => {
    token.description = tokenDescription;
    token2.description = token;
    token3.description = token2;
    expect(token3.referencesToken('description', token)).toBe(true);
  });

  test('checking if one token does not reference another works', () => {
    token2.description = tokenDescription;
    expect(token2.referencesToken('description', token)).toBe(false);
  });

  test('setting self as referenced token throws an Error', () => {
    expect(() => {
      token.description = token;
    }).toThrow(Error);
  });

  test('setting cyclical token references throws an Error', () => {
    token.description = tokenDescription;
    token2.description = token;
    expect(() => {
      token.description = token2;
    }).toThrow(Error);
  });
});


describe('JSON serialisation', () => {
  const tokenDescription = 'test description';
  const token2id = 'token2';
  const token2 = new Token({ id: token2id });

  test('ID is output by toJSON()', () => {
    const jsonObj = token.toJSON();
    expect(jsonObj.id).toBe(tokenId);
  });

  test('custom name is output by toJSON(), if set', () => {
    const customName = 'Test name';
    token.name = customName;
    const jsonObj = token.toJSON();
    expect(jsonObj.name).toBe(customName);
  });

  test('name is ommitted by toJSON(), if no custom name is set', () => {
    token.name = undefined;
    const jsonObj = token.toJSON();
    expect(jsonObj).not.toHaveProperty('name');
  });

  test('description is output by toJSON()', () => {
    token.description = tokenDescription;
    const jsonObj = token.toJSON();
    expect(jsonObj.description).toBe(tokenDescription);
  });

  test('description starting with escape char is correctly escaped by toJSON()', () => {
    const testDescription = `${ESCAPE_CHAR}${tokenDescription}`;
    token.description = testDescription;
    const jsonObj = token.toJSON();
    expect(jsonObj.description).toBe(escapeStringValue(testDescription));
  });


  test('description starting with reference prefix is correctly escaped by toJSON()', () => {
    const testDescription = `${REFERENCE_PREFIX}${tokenDescription}`;
    token.description = testDescription;
    const jsonObj = token.toJSON();
    expect(jsonObj.description).toBe(escapeStringValue(testDescription));
  });

  test('description is ommitted by toJSON() if it was not set', () => {
    token.description = undefined;
    const jsonObj = token.toJSON();
    expect(jsonObj).not.toHaveProperty('description');
  });

  test('token reference is output toJSON() if description references another token', () => {
    const token2Description = 'another description';
    token2.description = token2Description;
    token.description = token2;
    const jsonObj = token.toJSON();
    expect(jsonObj.description).toBe(token2.toReference());
  });

  test('custom property with non-string values is output correctly', () => {
    const testToken = new Token({ id: 'customPropTest' });
    const propName = 'testProp';
    testToken._addTokenProp(propName);
    const testVal = 42;
    testToken[propName] = testVal;
    const jsonObj = testToken.toJSON();
    expect(jsonObj[propName]).toBe(testVal);
  });
});

describe('Constructing from data', () => {
  const goodObj = {
    id: 'testId',
    name: 'testName',
    description: 'testDescription',
  };

  const badObj = {
    name: 'validName',
    foo: 42,
  };

  const badNoIdObj = {
    foo: 42,
  };

  test('constructing valid data works', () => {
    const t = new Token(goodObj);
    expect(t.id).toBe(goodObj.id);
    expect(t.name).toBe(goodObj.name);
    expect(t.description).toBe(goodObj.description);
  });

  test('data with invalid property throws UdtParseError', () => {
    expect(() => {
      new Token(badObj); // eslint-disable-line no-new
    }).toThrow(UdtParseError);
  });

  test('data with no ID throws TypeError', () => {
    expect(() => {
      new Token(badNoIdObj); // eslint-disable-line no-new
    }).toThrow(UdtParseError);
  });

  test('array data throws UdtParseError', () => {
    expect(() => {
      new Token([]); // eslint-disable-line no-new
    }).toThrow(UdtParseError);
  });

  test('string data throws UdtParseError', () => {
    expect(() => {
      new Token('test'); // eslint-disable-line no-new
    }).toThrow(UdtParseError);
  });
});
