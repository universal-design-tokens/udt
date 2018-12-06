const { File } = require('@udt/core');

// Parse an existing UDT file
File.load('../core/test/data/colors.udt').then((udtFile) => {
  console.log('/* === SASS vars (resolved values) === */\n');
  for (const color of udtFile.colors) {
    if (color.description) {
      console.log(`// ${color.description}`);
    }
    console.log(`$color-${color.id}: ${color.color};\n`);
  }
});
