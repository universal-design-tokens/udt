import { Type } from "./format/type";
import { DesignToken } from "./tom/design-token";
import { Group } from "./tom/group";
import { DesignTokenFile } from "./tom/design-token-file";
import { readFileSync } from 'fs';
import { TOMNode } from "./tom/tom-node";

function logTOMNodes(node: TOMNode, indent: string = '') {
  if (node instanceof DesignToken) {
    console.log(`${indent}* Token "${node.name}"`);
  }
  else if (node instanceof Group) {
    console.log(`${indent}* ${node instanceof DesignTokenFile ? 'File' : 'Group'} "${node.name}"`);
    for (const childNode of node) {
      logTOMNodes(childNode, `  ${indent}`);
    }
  }
  else {
    console.log(`${indent}X Unknown node type "${node.name}"`);
  }
}



console.log('----- TOM --> JSON -----');

const dt = new DesignToken("My first token", {value: "#ff0000", type: Type.COLOR});

const grp = new Group("My first group");
grp.addChild(dt);

const file = new DesignTokenFile('foo.tokens.json');
file.addChild(grp);

logTOMNodes(file);

console.log(dt.getPath());

const originalPath = dt.getPath();

if (file.getNodeByPath(originalPath) === dt) {
  console.log('Valid path resolved OK');
}
else {
  console.error('Valid path did NOT resolve :-(');
}

// Move token out of group to file level
file.addChild(dt);
logTOMNodes(file);
console.log(dt.getPath());

try {
  file.getNodeByPath(originalPath);
  console.error('Inavlid path resolved :-(');
}
catch (e) {
  console.log('Invalid path threw an error as expected');
}


// ===============================

console.log('\n\n');
console.log('----- JSON --> TOM -----');

function readJsonFile(path: string): any {
  return JSON.parse(readFileSync(path).toString());
}

function parseTokenFile(path: string): DesignTokenFile {
  const data = readJsonFile(path);
  return new DesignTokenFile(path, data);
}

const parsedFile = parseTokenFile('./src/dtcg/examples/test.tokens.json');

logTOMNodes(parsedFile);


