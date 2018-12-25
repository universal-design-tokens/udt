import ColorSet from './color-set';
import ColorToken from '../tokens/color-token';
import Token from '../base/token';

const colorJson = { id: 'red', color: '#333333' };

describe('Core Colors functionality', () => {
  let colors: ColorSet;
  let color: ColorToken;

  beforeEach(() => {
    colors = new ColorSet();
    color = new ColorToken(colorJson);
  });

  test('Adding color tokens works', () => {
    colors.add(color);
    expect(colors.has(color)).toBe(true);
  });

  test('Adding other tokens throws a TypeError', () => {
    const notColor = new Token({ id: 'foo' });
    expect(() => {
      colors.add(notColor as ColorToken);
    }).toThrow(TypeError);
  });

  test('Parsing an array of color data works', () => {
    const colorArray = [colorJson];
    const parsedColors = new ColorSet(colorArray);
    expect(parsedColors.size).toBe(colorArray.length);
  });
});
