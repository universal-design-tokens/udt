import { readFileSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';

export function getExampleFilePath(...pathSegments: string[]) {
  return resolve(__dirname, '..', '..', '..','..','example-files', ...pathSegments);
}

export const dtcgDevExampleFile = getExampleFilePath('dev', 'test.tokens.json');

export function readJsonFile(path: string): any {
  return JSON.parse(readFileSync(path).toString());
}

export function resolveFilepath(relativePath: string): string {
  return resolve( cwd(), relativePath );
}
