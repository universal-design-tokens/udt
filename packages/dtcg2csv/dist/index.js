"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tom_1 = require("@udt/tom");
const csv_stringify_1 = require("csv-stringify");
function generateTom() {
    const tomRoot = new tom_1.RootGroup();
    const colorNames = ["red", "green", "blue"];
    const colorGroup = new tom_1.Group("color", { type: "color" /* Type.COLOR */ });
    for (const colorName of colorNames) {
        const group = new tom_1.Group(colorName);
        for (let i = 1; i < 10; ++i) {
            const token = new tom_1.DesignToken(`${i * 100}`, "#ffaabb");
            group.addChild(token);
        }
        colorGroup.addChild(group);
    }
    tomRoot.addChild(colorGroup);
    return tomRoot;
}
function toCsvString(tom) {
    return new Promise((resolve, reject) => {
        const stringifier = (0, csv_stringify_1.stringify)();
        let data = [];
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
                token.name,
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
