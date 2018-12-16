import Token from '../base/token';

const rbgHexRegex = /^#([a-fA-F\d]{6})$/;

/**
 * The name of the ColorToken class's "color" property.
 *
 * May be used with tokens' `isReferencedValue()` and
 * `getReferencedToken()` methods.
 */
export const colorPropName = 'color';

/**
 * A color token.
 *
 * Color tokens represent a single, named color.
 */
export default class ColorToken extends Token {
  /**
   * This color token's actual color value.
   *
   * This may also reference another color token's value. To create
   * such a reference, simply assign the other color token object to
   * this `color` property.
   *
   * E.g.: `thisColorToken.color = otherColorToken;`
   *
   * Note that _reading_ this property will always return the actual
   * color _value_. In the above example, the referenced token's
   * color will be returned.
   *
   * When (re-)setting a color, checks will be performed to ensure that
   * it is a sutiable color string value or another `ColorToken` instance.
   * In the event that it is neither, a `TypeError` will be thrown.
   */
  public color: string | ColorToken;

  /**
   * Constructs a color token from a JSON object.
   *
   * The data passed in must valid UDT JSON for a color token. In
   * other words, it must be an object with at least `id` and `color`
   * properties.
   *
   * If the data is not an object or contains any unrecognized properties
   * a `UdtParseError` will be thrown.
   *
   * @param jsonObj   An object with the `id` and optionally,
   *                  `name` and/or `description` of this
   *                  token.
   */
  constructor(jsonObj: any) {
    const {
      color,
      ...rest
    } = jsonObj;
    super(rest);

    // Add .color property
    this._setupTokenProp(colorPropName, ColorToken.isValidColor, ColorToken.isColorToken);
    this.color = color;
  }

  /**
   * Checks if the input is a valid color string value.
   *
   * @param value The value to check.
   */
  static isValidColor(value: any): value is string {
    return (typeof value === 'string') && rbgHexRegex.test(value);
  }

  /**
   * Checks if the input is an instance of the
   * `ColorToken` class, or one of its sub-classes.
   *
   * @param token  The token to check.
   */
  static isColorToken(token: any): token is ColorToken {
    return token instanceof ColorToken;
  }
}
