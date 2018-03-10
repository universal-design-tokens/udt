import fs from 'fs';
import { promisify } from 'util';
import Colors from './sets/colors';
import { addPrivateProp, addPublicProp } from './base/utils';

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

  static async load(filename) {
    const data = await readFile(filename, 'utf8');
    const file = new File(JSON.parse(data));
    return file;
  }
}

export default File;
