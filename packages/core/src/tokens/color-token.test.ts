import ColorToken from './color-token';
import Token from '../base/token';

const colorId = 'red';
const colorValue = '#ff0000';

const otherColorId = 'green';
const otherColorValue = '#00ff00';

describe('Core color functionality', () => {
  let colorToken: ColorToken;
  let otherColorToken: ColorToken;

  beforeEach(() => {
    colorToken = new ColorToken({ id: colorId, color: colorValue });
    otherColorToken = new ColorToken({ id: otherColorId, color: otherColorValue });
  });

  test('color initialises ID correctly', () => {
    expect(colorToken.id).toBe(colorId);
  });

  test('color initialises color value correctly', () => {
    expect(colorToken.color).toBe(colorValue);
  });

  test('color value can reference another Color token', () => {
    otherColorToken.color = colorToken;
    expect(otherColorToken.color).toBe(colorValue);
  });

  test('setting other token type as color value throws a TypeError', () => {
    const token = new Token({ id: 'foo' });
    expect(() => {
      otherColorToken.color = token as ColorToken;
    }).toThrow(TypeError);
  });

  test('initialising without color value throws a TypeError', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new ColorToken({ id: colorId });
    }).toThrow(TypeError);
  });

  test('initialising with an invalid colour value throws a TypeError', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new ColorToken({ id: colorId, color: 'not a colour' });
    }).toThrow(TypeError);
  });
});
