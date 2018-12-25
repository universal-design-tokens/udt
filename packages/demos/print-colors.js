const { File, ColorToken } = require('@udt/lib');

// Parse an existing UDT file
File.load('../lib/test/data/colors.udt').then((udtFile) => {
  // Print out its color tokens
  console.group('Initial colors:');
  for (const color of udtFile.colors) {
    console.log(`Color "${color.name}" is: ${color.color}`);
  }
  console.groupEnd();

  // Programatically make a new color token
  const magenta = new ColorToken({
    id: 'magenta',
    name: 'Magnificent Magenta',
    color: '#ffff00',
  });

  // Add it to our file object
  udtFile.colors.add(magenta);

  // Print updated UDT file data
  console.group('New color:');
  console.log(JSON.stringify(udtFile, null, 2));
  console.groupEnd();

  // Make a new color token that references magenta
  // for its value (so, an alias or "decision" token)
  const magentaAlias = new ColorToken({
    id: 'maglias',
    color: magenta,
  });

  // Add it to our file object
  udtFile.colors.add(magentaAlias);

  // Print updated UDT file data
  console.group('Yet another color:');
  console.log(JSON.stringify(udtFile, null, 2));
  console.groupEnd();
});
