import { readFileSync } from 'fs';
import { RootGroup } from "@udt/tom";
import { parseFile } from "@udt/dtcg-parser";
import { stringify } from "csv-stringify";

function getArgs(): string[] {
  return process.argv.slice(2);
}

function readJsonFile(path: string): any {
  return JSON.parse(readFileSync(path).toString());
}

function toCsvString(tom: RootGroup): Promise<string> {
  return new Promise((resolve, reject) => {
    const stringifier = stringify();
    let data: string[] = [];

    stringifier.on("readable", () => {
      let csvRow;
      while ((csvRow = stringifier.read()) !== null) {
        data.push(csvRow);
      }
    });

    // Catch any error
    stringifier.on("error", function (err) {
      reject(err);
    });

    // When finished, validate the CSV output with the expected value
    stringifier.on("finish", function () {
      resolve(data.join("\n"));
    });

    // Write records to the stream
    for (const token of tom.traverseTokens()) {
      stringifier.write([
        token.getName(),
        token.getPath().join('.'),
        token.getResolvedType(),
        token.getValue(true)
      ]);
    }

    stringifier.end();
  });
}

async function run() {
  const args = getArgs();
  const inputFile = args[0];
  const data = readJsonFile(inputFile);
  const tom = parseFile(data);
  const csvData = await toCsvString(tom);
  console.log(csvData);
}

run();
