const { File } = require('@udt/lib');

// Parse an existing UDT file
File.load('../lib/test/data/colors.udt').then((udtFile) => {
  console.log('/* === SASS vars (referenced values) === */\n');
  for (const color of udtFile.colors) {
    if (color.description) {
      console.log(`// ${color.description}`);
    }

    if (color.isReferencedValue('color')) {
      const referencedColor = color.getReferencedToken('color');
      console.log(`$color-${color.id}: $color-${referencedColor.id};\n`);
    } else {
      console.log(`$color-${color.id}: ${color.color};\n`);
    }
  }
});
