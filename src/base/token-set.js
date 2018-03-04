import Token from './token';
import { addPrivateProp } from './utils';

function acceptAll() {
  return true;
}

class TokenSet {
  constructor(typeCheckFn = acceptAll) {
    addPrivateProp(this, '_tokens', new Set());
    addPrivateProp(this, '_typeCheckerFn', typeCheckFn);
  }

  has(token) {
    return this._tokens.has(token);
  }

  add(token) {
    if (!Token.isToken(token) || !this._typeCheckerFn(token)) {
      throw new TypeError(`${token} is not a valid Token for this set.`);
    }
    this._tokens.add(token);
    return this;
  }

  delete(token) {
    return this._tokens.delete(token);
  }

  clear() {
    this._tokens.clear();
  }

  values() {
    return this._tokens.values();
  }

  get size() {
    return this._tokens.size;
  }

  [Symbol.iterator]() {
    return this._tokens[Symbol.iterator]();
  }

  toJSON() {
    return [...this];
  }
}

export default TokenSet;
