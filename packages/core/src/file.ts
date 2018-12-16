import * as fs from 'fs';
import { promisify } from 'util';
import ColorSet from './sets/color-set';
import { addPrivateProp, addPublicProp } from './base/utils';
import { isReference, unescapeStringValue } from './base/reference-utils';
import DeferredReference from './base/deferred-reference';
import { UdtParseError } from './base/errors';

const readFile = promisify(fs.readFile);

class File {
  private _data: {
    colors?: ColorSet
  };

  public colors: ColorSet;

  constructor(jsonObj: any = {}) {
    if (typeof jsonObj !== 'object' || Array.isArray(jsonObj)) {
      throw new UdtParseError('Cannot parse UDT file from non-object.');
    }

    const {
      colors = [],
      ...rest
    } = jsonObj;

    if (Object.keys(rest).length > 0) {
      throw new UdtParseError(`Unexpected properties in input data: ${Object.keys(rest).join(', ')}`);
    }

    addPrivateProp(this, '_data');
    this._data = {};

    addPublicProp(
      this,
      'colors',
      () => this._data.colors,
      (newColors) => {
        if (!(newColors instanceof ColorSet)) {
          throw new TypeError('Cannot assign object that is not of type Colors to .colors.');
        }
        this._data.colors = newColors;
      },
    );
    this.colors = new ColorSet(colors);
  }

  findTokenByRef(tokenRef: string) {
    return this.colors.findTokenByRef(tokenRef);
  }

  static _getRefDeferrerFn(deferredRefs: DeferredReference[]) {
    return (key: any, jsonValue: any) => {
      let dataValue = jsonValue;
      if (typeof jsonValue === 'string') {
        if (isReference(jsonValue)) {
          const defRef = new DeferredReference(jsonValue);
          deferredRefs.push(defRef);
          dataValue = defRef;
        } else {
          dataValue = unescapeStringValue(jsonValue);
        }
      }
      return dataValue;
    };
  }

  static parse(udtJsonString: string) {
    const deferredRefs: DeferredReference[] = [];
    const refDeferrerFn = File._getRefDeferrerFn(deferredRefs);
    const file = new File(JSON.parse(udtJsonString, refDeferrerFn));
    deferredRefs.forEach((defRef) => {
      const token = file.findTokenByRef(defRef.refString);
      if (token === null) {
        throw new UdtParseError(`Could not find token referenced by "${defRef.refString}".`);
      }
      defRef.resolveReference(token);
    });
    return file;
  }

  static async load(filename: string) {
    const udtJsonString = await readFile(filename, 'utf8');
    return File.parse(udtJsonString);
  }
}

export default File;
