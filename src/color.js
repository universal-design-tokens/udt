import { Token } from './token';

class Color extends Token {
  /* eslint-disable class-methods-use-this */
  _checkValueType(value) {
    if (typeof value !== 'string') {
      throw new TypeError('Color value must be a string');
    }
  }
  /* eslint-enable class-methods-use-this */
}

export default Color;
