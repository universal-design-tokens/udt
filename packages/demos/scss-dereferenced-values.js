const { File } = require('@udt/lib');

// Parse an existing UDT file
File.load('../lib/test/data/colors.udt').then((udtFile) => {
  console.log('/* === SASS vars (resolved values) === */\n');
  for (const color of udtFile.colors) {
    if (color.description) {
      console.log(`// ${color.description}`);
    }
    console.log(`$color-${color.id}: ${color.color};\n`);
  }
});
