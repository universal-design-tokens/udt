import { readJsonFile, dtcgDraft2ExampleFile } from './utils/file';
import { DesignToken, Group, RootGroup, TOMNode } from "@udt/tom";
import { parseFile } from '@udt/dtcg-parser';
import { indentable, Indentable } from './utils/text-formatting';
import { formatValue } from './utils/value-formatters';

function formatTomNode(node: TOMNode): Indentable {
  if (node instanceof DesignToken) {
    return indentable(
      `* Token "${node.getName()}"`,
      indentable(
        `- resolved type: ${node.getResolvedType()}`,
        `- resolved value:`,
        indentable(formatValue(node.getResolvedValue(), node.getResolvedType())),
        `- is alias?: ${node.isAlias()}`,
        node.hasExtensions() ? `- has extensions: ${[...node.extensions()].map(keyExt => keyExt[0]).join(', ')}` : null
      )
    );
  }
  else if (node instanceof Group) {
    const childNodes = [...node].map(node => formatTomNode(node));

    return indentable(
      `* ${node instanceof RootGroup ? 'File' : 'Group'} "${node.getName()}"`,
      ...childNodes
    );
  }
  else {
    return indentable(`X Unknown node type "${node.getName()}"`);
  }
}

function logTOMNodes(root: TOMNode) {
  console.log(formatTomNode(root)());
}


console.log('\n\n');
console.log('----- JSON --> TOM -----');

function parseTokenFile(path: string): Group {
  const data = readJsonFile(path);
  return parseFile(data);
}

const parsedFile = parseTokenFile(dtcgDraft2ExampleFile);

logTOMNodes(parsedFile);
