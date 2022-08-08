import { ColorValue } from "@udt/tom";

const rgbaHexRegex = /^#(([a-fA-F\d]{2}){3,4})$/;

function hexToChannel(hexValue: string): number {
  return parseInt(hexValue, 16) / 255;
}

export function parseColorValue(value: unknown): ColorValue {
  if (typeof value === "string") {
    const matches = value.match(rgbaHexRegex);
    if (matches !== null) {
      const [_ignored, hexString] = matches;
      const red = hexToChannel(hexString.substring(0, 2));
      const green = hexToChannel(hexString.substring(2, 4));
      const blue = hexToChannel(hexString.substring(4, 6));
      const alpha =
        hexString.length === 8 ? hexToChannel(hexString.substring(0, 2)) : undefined;

      return new ColorValue({ channels: [red, green, blue], alpha });
    }
  }
  throw new Error(`${value} is not a valid DTCG color value`);
}

// export function isColor(value: any): value is ColorValue {
//   return typeof value === 'string' && rbgHexRegex.test(value);
// }
