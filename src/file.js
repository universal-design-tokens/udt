import fs from 'fs';
import { promisify } from 'util';
import Colors from './sets/colors';
import { addPrivateProp, addPublicProp } from './base/utils';
import { isReference, unescapeStringValue } from './base/reference-utils';
import DeferredReference from './base/deferred-reference';
import { UdtParseError } from './base/errors';

const readFile = promisify(fs.readFile);

class File {
  constructor({ colors = [] }) {
    addPrivateProp(this, '_data', {});

    addPublicProp(
      this,
      'colors',
      () => this._data.colors,
      (newColors) => {
        if (!(newColors instanceof Colors)) {
          throw new TypeError('Cannot assign object that is not of type Colors to .colors.');
        }
        this._data.colors = newColors;
      },
    );
    this.colors = new Colors(colors);
  }

  findTokenByRef(tokenRef) {
    return this.colors.findTokenByRef(tokenRef);
  }

  static _getRefDeferrerFn(deferredRefs) {
    return (key, jsonValue) => {
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

  static parse(udtJsonString) {
    const deferredRefs = [];
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

  static async load(filename) {
    const udtJsonString = await readFile(filename, 'utf8');
    return File.parse(udtJsonString);
  }
}

export default File;
