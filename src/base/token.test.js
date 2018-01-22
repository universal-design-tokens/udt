import Token from './token';

const tokenName = 'name';
const token = new Token(tokenName);

describe('Core Token properties', () => {
  test('token\'s name is accessible', () => {
    expect(token.name).toBe(tokenName);
  });

  test('token\'s handle matches name', () => {
    expect(token.handle).toBe(tokenName);
  });

  test('token\'s handle can be customised without altering name', () => {
    const customHandle = 'customHandle';
    token.handle = customHandle;
    expect(token.name).toBe(tokenName);
    expect(token.handle).toBe(customHandle);
  });

  test('custom token handle can be cleared by setting it to undefined', () => {
    // Set a custom handle
    const customHandle = 'customHandle';
    token.handle = customHandle;
    // Now clear it
    token.handle = undefined;
    // Without the custom handle, .handle should fall back to the .name
    expect(token.handle).toBe(tokenName);
  });

  test('creating token without a name throws an Error', () => {
    expect(() => new Token()).toThrow(TypeError);
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

  test('setting a non-string handle throws a TypeError', () => {
    expect(() => {
      token.handle = 42;
    }).toThrow(TypeError);
  });

  test('setting an empty string handle throws a TypeError', () => {
    expect(() => {
      token.handle = '';
    }).toThrow(TypeError);
  });
});


describe('Token description', () => {
  const tokenDescription = 'test description';
  const token2name = 'token2';
  const token2 = new Token(token2name);
  const token3name = 'token3';
  const token3 = new Token(token3name);

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

  test('token\'s descirption can be cleared by setting it to undefined', () => {
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

  test('referenced value\'s referenced token', () => {
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
  const token2name = 'token2';
  const token2 = new Token(token2name);

  test('name is output by toJSON()', () => {
    const jsonObj = token.toJSON();
    expect(jsonObj.name).toBe(tokenName);
  });

  test('custom handle is output by toJSON(), if set', () => {
    const customHandle = 'handle';
    token.handle = customHandle;
    const jsonObj = token.toJSON();
    expect(jsonObj.handle).toBe(customHandle);
  });

  test('handle is ommitted by toJSON(), if no custom handle is set', () => {
    token.handle = undefined;
    const jsonObj = token.toJSON();
    expect(jsonObj).not.toHaveProperty('handle');
  });

  test('description is output by toJSON()', () => {
    token.description = tokenDescription;
    const jsonObj = token.toJSON();
    expect(jsonObj.description).toBe(tokenDescription);
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
    expect(jsonObj).not.toBe('@foobar');
  });
});
