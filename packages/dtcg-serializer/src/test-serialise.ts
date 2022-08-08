import { ColorValue, DesignToken, DimensionValue, Group, RootGroup, Type } from "@udt/tom";
import { serializeDtcgFile } from "./serialize-node";

console.log("----- TOM --> JSON -----");

const mediumToken = new DesignToken(
  "medium",
  new DimensionValue({ amount: 2.75, unit: "rem" }),
  { type: Type.DIMENSION }
);
mediumToken.setExtension("design.udt.test", 42);

const sizeGroup = new Group("size");
sizeGroup.addChild(mediumToken);

const redToken = new DesignToken("red", new ColorValue({ channels: [1, 0.5, 0]}), { type: Type.COLOR });

const file = new RootGroup();
file.addChild(sizeGroup);
file.addChild(redToken);

console.log(JSON.stringify(serializeDtcgFile(file), undefined, 2));
