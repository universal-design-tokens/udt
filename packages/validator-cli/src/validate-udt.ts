import { resolve as pathResolve } from 'path';
import { UdtValidator } from '@udt/validator';

const udtValidator = new UdtValidator();

const udtFile = process.argv[2];
const udtFilePath = pathResolve(process.cwd(), udtFile);

udtValidator.validateUdtFile(udtFilePath).then(
  (isValid) => {
    console.log(`${udtFile} is a valid UDT file.`);
    process.exit(0);
  }
).catch(
  (errors) => {
    console.error(`${udtFile} is invalid:`);
    console.error(errors);
    process.exit(1);
  }
);
