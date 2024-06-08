import { RootGroup, TOMNode } from "@udt/tom";
import { parseFile } from '@udt/dtcg-parser';
import { formatTomNode } from './utils/tom-formatters.js';
import { readJsonFile, dtcgDevExampleFile } from './utils/file.js';
import { getArgs } from "./utils/cli-args.js";

function logTOMNodes(root: TOMNode) {
  console.log(formatTomNode(root)());
}

function parseTokenFile(path: string): RootGroup {
  const data = readJsonFile(path);
  return parseFile(data);
}

const [ inputFile ] = getArgs();
logTOMNodes(parseTokenFile(inputFile || dtcgDevExampleFile));
