import path from 'path';
import File from './file';
import Colors from './sets/colors';

const okTestData = {
  colors: [
    {
      id: 'Color-1',
      color: '#123456',
    },
    {
      id: 'Color-2',
      color: '#654321',
    },
  ],
};

describe('Core File functionality', () => {
  test('Can be constructed from empty data', () => {
    const file = new File({});
    expect(file.colors).toBeInstanceOf(Colors);
  });

  test('Can be constructed from valid data', () => {
    const file = new File(okTestData);
    expect(file.colors).toBeInstanceOf(Colors);
  });

  test('Assigning a new Colors set works', () => {
    const colors = new Colors(okTestData.colors);
    const file = new File({});
    file.colors = colors;
    expect(file.colors).toBe(colors);
  });

  test('Assigning non-Colors throws a TypeError', () => {
    const file = new File({});
    expect(() => {
      file.colors = 'bad';
    }).toThrow(TypeError);
  });
});

describe('Reading and writing UDT files', () => {
  const udtFilename = path.join(__dirname, '..', 'test', 'data', 'colors.udt');

  test('Reading valid UDT file works', async () => {
    const file = await File.load(udtFilename);
    expect(file).toBeInstanceOf(File);
  });
});
