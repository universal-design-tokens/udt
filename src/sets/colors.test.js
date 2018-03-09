import Colors from './colors';
import Color from '../tokens/color';
import Token from '../base/token';

const colors = new Colors();
const colorJson = { name: 'red', color: '#333333' };
const color = new Color(colorJson);

describe('Core Colors functionality', () => {
  test('Adding color tokens works', () => {
    colors.add(color);
    expect(colors.has(color)).toBe(true);
  });

  test('Adding other tokens throws a TypeError', () => {
    const notColor = new Token({ name: 'foo' });
    expect(() => {
      colors.add(notColor);
    }).toThrow(TypeError);
  });

  test('Parsing an array of color data works', () => {
    const colorArray = [colorJson];
    const parsedColors = new Colors(colorArray);
    expect(parsedColors.size).toBe(colorArray.length);
  });
});
