import { validateUdtSchema } from '@udt/validator';

validateUdtSchema().then(
  () => {
    console.log('UDT schema is valid.');
    process.exit(0);
  }
).catch(
  (errors) => {
    console.error('UDT schema is invalid!');
    console.error(errors);
    process.exit(1);
  }
);
