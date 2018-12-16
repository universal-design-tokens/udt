import * as path from 'path';
import File from './file';
import ColorSet from './sets/color-set';
import Token from './base/token';
import DeferredReference from './base/deferred-reference';
import { idToReference, escapeStringValue } from './base/reference-utils';
import { UdtParseError } from './base/errors';

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
    expect(file.colors).toBeInstanceOf(ColorSet);
  });

  test('Can be constructed from valid data', () => {
    const file = new File(okTestData);
    expect(file.colors).toBeInstanceOf(ColorSet);
  });

  test('Assigning a new Colors set works', () => {
    const colors = new ColorSet(okTestData.colors);
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

describe('Finding tokens', () => {
  test('An existing token can be found by its ID ref', () => {
    const file = new File(okTestData);
    const searchId = okTestData.colors[0].id;
    const searchRef = idToReference(searchId);
    const foundToken = file.findTokenByRef(searchRef);
    expect(foundToken).not.toBeNull();
    expect(foundToken).toBeInstanceOf(Token);
    expect(foundToken.id).toBe(searchId);
  });

  test('Searching for a non-existing token returns null', () => {
    const file = new File(okTestData);
    const searchId = 'does-not-exist';
    const searchRef = idToReference(searchId);
    const foundToken = file.findTokenByRef(searchRef);
    expect(foundToken).toBeNull();
  });
});

describe('Internal _getRefDeferrerFn() helper', () => {
  const ignoredKey = 'ignored';

  test('Returns a function', () => {
    const defRefs = [];
    const refDefFn = File._getRefDeferrerFn(defRefs);
    expect(typeof refDefFn).toBe('function');
  });

  test('Returned reviver function passes through basic values', () => {
    const defRefs = [];
    const refDefFn = File._getRefDeferrerFn(defRefs);

    const testString = 'testString';
    expect(refDefFn(ignoredKey, testString)).toBe(testString);
    const testNumber = 123;
    expect(refDefFn(ignoredKey, testNumber)).toBe(testNumber);
    const testObj = {};
    expect(refDefFn(ignoredKey, testObj)).toBe(testObj);

    // Nothing should have been added to defRefs
    expect(defRefs.length).toBe(0);
  });

  test('Returned reviver function unescapes escaped strings', () => {
    const defRefs = [];
    const refDefFn = File._getRefDeferrerFn(defRefs);

    const stringThatNeedsEscaping = '\\starts with special escape char';
    expect(refDefFn(ignoredKey, escapeStringValue(stringThatNeedsEscaping)))
      .toBe(stringThatNeedsEscaping);

    // Nothing should have been added to defRefs
    expect(defRefs.length).toBe(0);
  });

  test('Returned reviver function returns and pushes deferred reference', () => {
    const defRefs = [];
    const refDefFn = File._getRefDeferrerFn(defRefs);

    const testId = 'test-id';
    const testRef = idToReference(testId);
    const result = refDefFn(ignoredKey, testRef);
    expect(result).toBeInstanceOf(DeferredReference);
    expect(result.refString).toBe(testRef);

    // Nothing should have been added to defRefs
    expect(defRefs.length).toBe(1);
    expect(defRefs[0]).toBe(result);
  });
});

describe('Parsing UDT data', () => {
  test('Parsing valid UDT data creates file object', () => {
    const udtJsonString = JSON.stringify(okTestData);
    const file = File.parse(udtJsonString);
    expect(file).toBeInstanceOf(File);
  });

  test('Parsing UDT data containing an invalid reference throws a UdtParseError', () => {
    const badData = {
      colors: [
        {
          id: 'Color-invalid',
          color: '@does-not-exist',
        },
      ],
    };

    const udtJsonString = JSON.stringify(badData);
    expect(() => {
      File.parse(udtJsonString);
    }).toThrow(UdtParseError);
  });
});


describe('Reading and writing UDT files', () => {
  const udtFilename = path.join(__dirname, '..', 'test', 'data', 'colors.udt');

  test('Reading valid UDT file works', async () => {
    const file = await File.load(udtFilename);
    expect(file).toBeInstanceOf(File);
  });
});
