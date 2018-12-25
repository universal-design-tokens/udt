import Token, { CheckerFn } from './token';
import { addPrivateProp } from './utils';
import { UdtParseError } from './errors';

/**
 * A function that can create a `Token`-derived object from
 * JSON data.
 */
export type TokenFromDataFn<T extends Token> = (data: any) => T;

/**
 * Base class for all token sets.
 */
export default class TokenSet<T extends Token> {
  private _tokens: Set<T>;
  private _typeCheckerFn: CheckerFn<T>;

  constructor(typeCheckFn: CheckerFn<T>, tokenFromDataFn: TokenFromDataFn<T>, dataArray: any = []) {
    if (typeof dataArray !== 'object' || !Array.isArray(dataArray)) {
      throw new UdtParseError('Cannot parse token set from non-array.');
    }

    addPrivateProp(this, '_tokens');
    this._tokens = new Set<T>();

    addPrivateProp(this, '_typeCheckerFn');
    this._typeCheckerFn = typeCheckFn;

    dataArray.forEach((data) => {
      this.add(tokenFromDataFn(data));
    });
  }

  findTokenByRef(tokenRef: string) {
    let result = null;
    for (const token of this.values()) {
      if (token.toReference() === tokenRef) {
        result = token;
        break;
      }
    }
    return result;
  }

  has(token: T) {
    return this._tokens.has(token);
  }

  add(token: T) {
    if (!Token.isToken(token) || !this._typeCheckerFn(token)) {
      throw new TypeError(`${token} is not a valid Token for this set.`);
    }
    this._tokens.add(token);
    return this;
  }

  delete(token: T) {
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
