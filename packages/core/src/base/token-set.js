import Token from './token';
import { addPrivateProp } from './utils';
import { UdtParseError } from './errors';

function acceptAll() {
  return true;
}

function tokenFromData(data) {
  return new Token(data);
}

class TokenSet {
  constructor(typeCheckFn = acceptAll, dataArray = [], tokenFromDataFn = tokenFromData) {
    if (typeof dataArray !== 'object' || !Array.isArray(dataArray)) {
      throw new UdtParseError('Cannot parse token set from non-array.');
    }

    addPrivateProp(this, '_tokens', new Set());
    addPrivateProp(this, '_typeCheckerFn', typeCheckFn);

    dataArray.forEach((data) => {
      this.add(tokenFromDataFn(data));
    });
  }

  findTokenByRef(tokenRef) {
    let result = null;
    for (const token of this.values()) {
      if (token.toReference() === tokenRef) {
        result = token;
        break;
      }
    }
    return result;
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
