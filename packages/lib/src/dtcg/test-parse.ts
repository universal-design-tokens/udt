import { resolve } from 'path';
import { DesignToken } from "./tom/design-token";
import { Group } from "./tom/group";
import { RootGroup } from "./tom/root-group";
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
    console.log(`${indent}* ${node instanceof RootGroup ? 'File' : 'Group'} "${node.name}"`);
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

function parseTokenFile(path: string): RootGroup {
  const data = readJsonFile(path);
  return new RootGroup(path, data);
}

const parsedFile = parseTokenFile(resolve(__dirname, '../../src/dtcg/examples/draft-2/test.tokens.json'));

logTOMNodes(parsedFile);


