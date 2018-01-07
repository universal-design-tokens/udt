import Token from './token';

const tokenName = 'name';

describe('Core Token properties', () => {
  const token = new Token(tokenName);

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


const tokenDescription = 'test description';

describe('Core Token properties', () => {
  const token = new Token(tokenName);

  const token2name = 'token2';
  const token2 = new Token(token2name);

  test('token\'s description is accessible', () => {
    token.description = tokenDescription;
    expect(token.description).toBe(tokenDescription);
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
});
