import { resolve } from 'path';
import { DesignToken } from "./tom/design-token";
import { Group } from "./tom/group";
import { DtcgFile } from './tom/dtcg-file';
import { readFileSync } from 'fs';
import { serializeDtcgFile } from './serializer/serialize-node';

function isDraft1TokenData(data: any): boolean {
  return typeof data === 'object' && data.value !== undefined;
}

function isDraft1GroupData(data: any): boolean {
  return typeof data === 'object' && data !== null;
}

function parseToken(name: string, data: any): DesignToken {
  const {
    type,
    value,
    description,
    extensions
  } = data;

  const token = new DesignToken(name, value);

  token.setType(type);
  token.setValue(value);
  token.description = description;

  return token;
}

function parseChildren(children: any, group: Group): void {
  for (const childName in children) {
    const childData = children[childName];
    if (isDraft1TokenData(childData)) {
      group.addChild(parseToken(childName, childData))
    }
    else if (isDraft1GroupData(childData)) {
      group.addChild(parseGroup(childName, childData));
    }
    else {
      console.error(`${childData} is neither a token nor a group!`);
    }
  }
}

function parseGroup(name: string, data: any): Group {
  const {
    description,
    ...children
  } = data;

  const group = new Group(name);
  group.description = description;
  parseChildren(children, group);
  return group;
}

function parseFile(data: any): DtcgFile {
  const {
    description,
    ...children
  } = data;

  const file = new DtcgFile();
  file.description = description;
  parseChildren(children, file);
  return file;
}

function readJsonFile(path: string): any {
  return JSON.parse(readFileSync(path).toString());
}

function parseDraft1TokenFile(path: string): DtcgFile {
  const data = readJsonFile(path);
  return parseFile(data);
}

const parsedFile = parseDraft1TokenFile(resolve(__dirname, '../../src/dtcg/examples/draft-1/test.tokens.json'));

console.log('----- DTCG Draft 1 --> TOM --> DTCG Draft 2 -----');
console.log(JSON.stringify(serializeDtcgFile(parsedFile), undefined, 2));


