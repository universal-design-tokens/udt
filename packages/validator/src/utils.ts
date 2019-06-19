import { readFile } from 'fs';

export async function readJsonFile(filePath: string) {
  const fileContents = await new Promise<Buffer>((resolve, reject) => {
    readFile(filePath, (err, contents) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(contents)
      }
    })
  });

  return JSON.parse(fileContents.toString('utf8'));
}
