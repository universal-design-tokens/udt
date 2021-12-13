import { Type } from "./format/type";
import { DesignToken } from "./tom/design-token";
import { Group } from "./tom/group";
import { DesignTokenFile } from "./tom/design-token-file";
import { readFileSync } from 'fs';
import { TOMNode } from "./tom/tom-node";

function logTOMNodes(node: TOMNode, indent: string = '') {
  if (node instanceof DesignToken) {
    console.log(`${indent}* Token "${node.name}"`);
    console.log(`${indent}  - type:      ${node.getType()}`);
    console.log(`${indent}  - value:     ${node.getValue()}`);
    console.log(`${indent}  - is alias?: ${node.isAlias()}`);
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


