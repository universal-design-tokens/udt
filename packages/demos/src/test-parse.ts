import { RootGroup, TOMNode } from "@udt/tom";
import { parseFile } from '@udt/dtcg-parser';
import { formatTomNode } from './utils/tom-formatters';
import { readJsonFile, dtcgDraft2ExampleFile } from './utils/file';

function logTOMNodes(root: TOMNode) {
  console.log(formatTomNode(root)());
}

function parseTokenFile(path: string): RootGroup {
  const data = readJsonFile(path);
  return parseFile(data);
}

logTOMNodes(parseTokenFile(dtcgDraft2ExampleFile));
