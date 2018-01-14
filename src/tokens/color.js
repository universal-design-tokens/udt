import Token from '../base/token';

const rbgHexRegex = /^#([a-fA-F\d]{6})$/;

class Color extends Token {
  constructor(name, color) {
    super(name);
    this._addTokenProp('color', Color.isValidColor, Color.isColorToken);

    this.color = color;
  }

  static isValidColor(value) {
    return (typeof value === 'string') && rbgHexRegex.test(value);
  }

  static isColorToken(token) {
    return token instanceof Color;
  }
}

export default Color;
