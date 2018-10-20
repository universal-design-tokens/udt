
import ImportedColor from './tokens/color';
import { Color as ExportedColor } from './index';

describe('Exported types', () => {
  test('Color is exported correctly', () => {
    expect(ExportedColor).toBe(ImportedColor);
  });
});
