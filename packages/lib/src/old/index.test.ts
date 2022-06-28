
import ImportedColor from './tokens/color-token';
import { ColorToken as ExportedColor } from './index';

describe('Exported types', () => {
  test('Color is exported correctly', () => {
    expect(ExportedColor).toBe(ImportedColor);
  });
});
