import { DesignToken, Group, DtcgFile, Type } from "@udt/tom";
import { serializeDtcgFile } from './serialize-node';

console.log('----- TOM --> JSON -----');

const redToken = new DesignToken("red", "#ff0000", { type: Type.COLOR });
redToken.setExtension('design.udt.test', 42);

const colorGroup = new Group("color");
colorGroup.addChild(redToken);

const file = new DtcgFile();
file.addChild(colorGroup);

console.log(JSON.stringify(serializeDtcgFile(file), undefined, 2));

