import Ajv, { Options, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import udtSpecInfos from '@udt/spec';
import { readJsonFile } from './utils';

const ajvOptions: Options = {
  verbose: true,
  validateFormats: true,
  allowUnionTypes: true,
};

export async function validateUdtSchema() {
  const ajv = new Ajv(ajvOptions);
  const udtSchema = udtSpecInfos.dev.schema;
  const isValid = ajv.validateSchema(udtSchema);

  if (!isValid) {
    const errors = ajv.errors;
    throw(errors);
  }

  return true;
}

export async function getUdtValidator() {
  const ajv = addFormats(new Ajv(ajvOptions));
  const udtSchema = udtSpecInfos.dev.schema;
  return ajv.compile(udtSchema);
}

export class UdtValidator {
  private _validateFn?: ValidateFunction;

  async validateUdtFile(filePath: string) {
    if (this._validateFn === undefined) {
      this._validateFn = await getUdtValidator();
    }

    const udtData = await readJsonFile(filePath);
    const isValid = this._validateFn(udtData);

    if (!isValid) {
      const errors = this._validateFn.errors;
      throw(errors);
    }

    return true;
  }
}
