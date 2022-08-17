import { DesignToken, Group, RootGroup, Type } from "@udt/tom";
import { stringify } from "csv-stringify";

function generateTom(): RootGroup {
  const tomRoot = new RootGroup();

  const colorNames = ["red", "green", "blue"];

  const colorGroup = new Group("color", { type: Type.COLOR });
  for (const colorName of colorNames) {
    const group = new Group(colorName);
    for (let i = 1; i < 10; ++i) {
      const token = new DesignToken(`${i * 100}`, "#ffaabb");
      group.addChild(token);
    }
    colorGroup.addChild(group);
  }

  tomRoot.addChild(colorGroup);

  return tomRoot;
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
        token.getResolvedValue()
      ]);
    }

    stringifier.end();
  });
}

async function run() {
  const tom = generateTom();
  const csvData = await toCsvString(tom);
  console.log(csvData);
}

run();
