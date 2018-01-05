import {Token} from './token';

class Color extends Token {

  _checkValueType (value) {
    if ( typeof value !== 'string' ) {
      throw new TypeError('Color value must be a string');
    }
  }

}

export { Color };
