import Token from './token';

const tokenName = 'name';
const tokenValue = 42;
const token = new Token(tokenName, tokenValue);

test('token\'s name is accessible', () => {
  expect(token.name).toBe(tokenName);
});

test('token\'s value is accessible', () => {
  expect(token.value).toBe(tokenValue);
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
  expect(() => new Token()).toThrow(Error);
});

test('creating token without a value throws an Error', () => {
  expect(() => new Token(tokenName)).toThrow(Error);
});
