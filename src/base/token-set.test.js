import TokenSet from './token-set';
import Token from './token';

describe('Core TokenSet functionality', () => {
  const tokenSet = new TokenSet();

  test('TokenSet is initially empty', () => {
    expect(tokenSet.size).toBe(0);
  });

  test('Adding something other than a token throws a TypeError', () => {
    expect(() => {
      tokenSet.add(42);
    }).toThrow(TypeError);
  });

  test('Adding a token increments the size', () => {
    const initialSize = tokenSet.size;
    tokenSet.add(new Token('test'));
    expect(tokenSet.size).toBe(initialSize + 1);
  });

  test('Adding the same token multiple times only increments the size once', () => {
    const initialSize = tokenSet.size;
    const token = new Token('test 2');
    tokenSet.add(token);
    tokenSet.add(token);
    expect(tokenSet.size).toBe(initialSize + 1);
  });

  test('add() returns the token set', () => {
    const returnVal = tokenSet.add(new Token('test 3'));
    expect(returnVal).toBe(tokenSet);
  });

  test('Presence of a token in the set can be checked', () => {
    const token = new Token('foo');
    expect(tokenSet.has(token)).toBe(false);
    tokenSet.add(token);
    expect(tokenSet.has(token)).toBe(true);
  });

  test('Tokens can be deleted', () => {
    const token = new Token('bar');
    tokenSet.add(token);
    tokenSet.delete(token);
    expect(tokenSet.has(token)).toBe(false);
  });

  test('Deleting a token in the set returns true', () => {
    const token = new Token('barfoo');
    tokenSet.add(token);
    const returnVal = tokenSet.delete(token);
    expect(returnVal).toBe(true);
  });

  test('Deleting a token not in the set returns false', () => {
    const returnVal = tokenSet.delete(new Token('barfoo'));
    expect(returnVal).toBe(false);
  });

  test('Token set can be cleared', () => {
    tokenSet.add(new Token('test 1'));
    tokenSet.add(new Token('test 2'));
    tokenSet.clear();
    expect(tokenSet.size).toBe(0);
  });

  test('values() returns an iterable', () => {
    tokenSet.clear();

    const testTokens = [
      new Token('t1'),
      new Token('t2'),
      new Token('t3'),
    ];

    for (const token of testTokens) {
      tokenSet.add(token);
    }

    const values = tokenSet.values();

    // Tokens should come out in the same
    // order that they were inserted.
    let i = 0;
    for (const token of values) {
      expect(token).toBe(testTokens[i]);
      i += 1;
    }

    expect(i).toBe(testTokens.length);
  });

  test('token set is iterable', () => {
    tokenSet.clear();

    const testTokens = [
      new Token('t1'),
      new Token('t2'),
      new Token('t3'),
    ];

    for (const token of testTokens) {
      tokenSet.add(token);
    }

    // Now try iterating over the set.
    // Tokens should come out in the same
    // order that they were inserted.
    let i = 0;
    for (const token of tokenSet) {
      expect(token).toBe(testTokens[i]);
      i += 1;
    }

    expect(i).toBe(testTokens.length);
  });

  test('toJSON() on an empty token set returns an empty array', () => {
    tokenSet.clear();

    const jsonData = tokenSet.toJSON();
    expect(Array.isArray(jsonData)).toBe(true);
    expect(jsonData).toHaveLength(0);
  });

  test('toJSON() returns an array of tokens', () => {
    tokenSet.clear();

    const testTokens = [
      new Token('t1'),
      new Token('t2'),
      new Token('t3'),
    ];

    for (const token of testTokens) {
      tokenSet.add(token);
    }

    const jsonData = tokenSet.toJSON();
    expect(Array.isArray(jsonData)).toBe(true);
    expect(jsonData).toHaveLength(testTokens.length);

    for (let i = 0; i < jsonData.length; i += 1) {
      expect(jsonData[i]).toBe(testTokens[i]);
    }
  });
});

describe('TokenSet with custom type checking', () => {
  class TestToken extends Token {}
  class OtherToken extends Token {}

  function isTestToken(token) {
    return token instanceof TestToken;
  }

  const tokenSet = new TokenSet(isTestToken);

  test('Adding a valid token works', () => {
    const token = new TestToken('test');
    tokenSet.add(token);
    expect(tokenSet.has(token)).toBe(true);
  });

  test('Adding an invalid token throws a TypeError', () => {
    expect(() => {
      tokenSet.add(new OtherToken('fail'));
    }).toThrow(TypeError);
  });
});
