import Color from './color';
import Token from '../base/token';

const colorId = 'red';
const colorValue = '#ff0000';
const colorToken = new Color({ id: colorId, color: colorValue });

const otherColorId = 'green';
const otherColorValue = '#00ff00';
const otherColorToken = new Color({ id: otherColorId, color: otherColorValue });

describe('Core color functionality', () => {
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
      otherColorToken.color = token;
    }).toThrow(TypeError);
  });

  test('initialising without color value throws a TypeError', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Color({ id: colorId });
    }).toThrow(TypeError);
  });

  test('initialising with an invalide colour value throws a TypeError', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Color({ id: colorId, color: 'not a colour' });
    }).toThrow(TypeError);
  });
});
