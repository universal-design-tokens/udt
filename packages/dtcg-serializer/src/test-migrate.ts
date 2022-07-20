import { resolve } from 'path';
import { readFileSync } from 'fs';
import { DesignToken, Group, RootGroup } from "@udt/tom";
import { serializeDtcgFile } from './serialize-node';

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
  token.setDescription(description);

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
  group.setDescription(description);
  parseChildren(children, group);
  return group;
}

function parseFile(data: any): RootGroup {
  const {
    description,
    ...children
  } = data;

  const file = new RootGroup();
  file.setDescription(description);
  parseChildren(children, file);
  return file;
}

function readJsonFile(path: string): any {
  return JSON.parse(readFileSync(path).toString());
}

function parseDraft1TokenFile(path: string): RootGroup {
  const data = readJsonFile(path);
  return parseFile(data);
}

const parsedFile = parseDraft1TokenFile(resolve(__dirname, '../../../example-files/draft-1/test.tokens.json'));

console.log('----- DTCG Draft 1 --> TOM --> DTCG Draft 2 -----');
console.log(JSON.stringify(serializeDtcgFile(parsedFile), undefined, 2));


