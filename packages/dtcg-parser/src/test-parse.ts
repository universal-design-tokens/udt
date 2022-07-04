import { resolve } from 'path';
import { readFileSync } from 'fs';
import { DesignToken, Group, DtcgFile, TOMNode } from "@udt/tom";
import { parseFile } from './parse-file';

function logTOMNodes(node: TOMNode, indent: string = '') {
  if (node instanceof DesignToken) {
    console.log(`${indent}* Token "${node.name}"`);
    console.log(`${indent}  - type:      ${node.getType()}`);
    console.log(`${indent}  - value:     ${node.getValue()}`);
    console.log(`${indent}  - is alias?: ${node.isAlias()}`);
    if (node.hasExtensions()) {
      console.log(`${indent}  - has extensions: ${[...node.extensions()].map(keyExt => keyExt[0]).join(', ')}`);
    }
  }
  else if (node instanceof Group) {
    console.log(`${indent}* ${node instanceof DtcgFile ? 'File' : 'Group'} "${node.name}"`);
    for (const childNode of node) {
      logTOMNodes(childNode, `  ${indent}`);
    }
  }
  else {
    console.log(`${indent}X Unknown node type "${node.name}"`);
  }
}


console.log('\n\n');
console.log('----- JSON --> TOM -----');

function readJsonFile(path: string): any {
  return JSON.parse(readFileSync(path).toString());
}

function parseTokenFile(path: string): Group {
  const data = readJsonFile(path);
  return parseFile(data);
}

const parsedFile = parseTokenFile(resolve(__dirname, '../../../example-files/draft-2/test.tokens.json'));

logTOMNodes(parsedFile);


