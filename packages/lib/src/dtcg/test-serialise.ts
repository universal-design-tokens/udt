import { Type } from "./format/type";
import { DesignToken } from "./tom/design-token";
import { Group } from "./tom/group";
import { DesignTokenFile } from "./tom/design-token-file";


console.log('----- TOM --> JSON -----');

const redToken = new DesignToken("red", {value: "#ff0000", type: Type.COLOR});

const colorGroup = new Group("color");
colorGroup.addChild(redToken);

const file = new DesignTokenFile('foo.tokens.json');
file.addChild(colorGroup);

console.log(JSON.stringify(file, undefined, 2));

// console.log(dt.getPath());

// const originalPath = dt.getPath();

// if (file.getNodeByPath(originalPath) === dt) {
//   console.log('Valid path resolved OK');
// }
// else {
//   console.error('Valid path did NOT resolve :-(');
// }

// Move token out of group to file level
// file.addChild(dt);
// logTOMNodes(file);
// console.log(dt.getPath());

// try {
//   file.getNodeByPath(originalPath);
//   console.error('Inavlid path resolved :-(');
// }
// catch (e) {
//   console.log('Invalid path threw an error as expected');
// }

