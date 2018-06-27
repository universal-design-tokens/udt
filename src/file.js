import fs from 'fs';
import { promisify } from 'util';
import Colors from './sets/colors';
import { addPrivateProp, addPublicProp } from './base/utils';
import { isReference, unescapeStringValue } from './base/reference-utils';

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

  findByRef(tokenRef) {
    return this.colors.findByRef(tokenRef);
  }

  static jsonToData(jsonData, file) {
    const data = {};
    Object.keys(jsonData).forEach((propName) => {
      let propVal = jsonData[propName];
      // Find referenced tokens or unescape string values
      if (typeof propVal === 'string') {
        if (isReference(propVal)) {
          propVal = file.findByRef(propVal);
        } else {
          propVal = unescapeStringValue(propVal);
        }
      }
      data[propName] = propVal;
    });
    // Construct token from data
    return data;
  }

  static async load(filename) {
    const data = await readFile(filename, 'utf8');
    const file = new File(JSON.parse(data));
    return file;
  }
}

export default File;
