import Color from './color';
import Token from '../base/token';

const colorName = 'red';
const colorValue = '#ff0000';
const colorToken = new Color({ name: colorName, color: colorValue });

const otherColorName = 'green';
const otherColorValue = '#00ff00';
const otherColorToken = new Color({ name: otherColorName, color: otherColorValue });

describe('Core color functionality', () => {
  test('color initialises name correctly', () => {
    expect(colorToken.name).toBe(colorName);
  });

  test('color initialises color value correctly', () => {
    expect(colorToken.color).toBe(colorValue);
  });

  test('color value can reference another Color token', () => {
    otherColorToken.color = colorToken;
    expect(otherColorToken.color).toBe(colorValue);
  });

  test('setting other token type as color value throws a TypeError', () => {
    const token = new Token({ name: 'foo' });
    expect(() => {
      otherColorToken.color = token;
    }).toThrow(TypeError);
  });

  test('initialising without color value throws a TypeError', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Color({ name: colorName });
    }).toThrow(TypeError);
  });

  test('initialising with an invalide colour value throws a TypeError', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Color({ name: colorName, color: 'not a colour' });
    }).toThrow(TypeError);
  });
});
