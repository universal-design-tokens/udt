import { resolve } from 'path';
import { parseFile } from './parser/parse-file';
import { DesignToken } from "./tom/design-token";
import { Group } from "./tom/group";
import { DtcgFile } from "./tom/dtcg-file";
import { readFileSync } from 'fs';
import { TOMNode } from "./tom/tom-node";

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

const parsedFile = parseTokenFile(resolve(__dirname, '../../src/dtcg/examples/draft-2/test.tokens.json'));

logTOMNodes(parsedFile);


