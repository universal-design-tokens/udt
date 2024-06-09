import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

export function getExampleFilePath(...pathSegments: string[]) {
  return resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..','..','example-files', ...pathSegments);
}

export const dtcgDevExampleFile = getExampleFilePath('dev', 'test.tokens.json');

export function readJsonFile(path: string): any {
  return JSON.parse(readFileSync(path).toString());
}

export function resolveFilepath(relativePath: string): string {
  return resolve( cwd(), relativePath );
}
