import { ColorValue, DesignToken, DimensionValue, Group, RootGroup, ShadowValue, Type } from "@udt/tom";
import { serializeDtcgFile } from "@udt/dtcg-serializer";

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

const shadowToken = new DesignToken("shadow", new ShadowValue({
  color: new ColorValue({ channels: [0, 0, 0], alpha: 0.6}),
  offsetX: new DimensionValue({ amount: 1, unit: "rem" }),
  offsetY: new DimensionValue({ amount: 1, unit: "rem" }),
  blur: new DimensionValue({ amount: 2, unit: "rem" }),
  spread: new DimensionValue({ amount: 0, unit: "rem" }),
}), { type: Type.SHADOW});

const file = new RootGroup();
file.addChild(sizeGroup);
file.addChild(redToken);
file.addChild(shadowToken);

console.log(JSON.stringify(serializeDtcgFile(file), undefined, 2));
