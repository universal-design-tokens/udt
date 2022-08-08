import { ColorValue } from "@udt/tom";

export type DtcgColorValue = string;

function channelToHex(value: number): string {
  return Math.round(value * 255).toString(16);
}

export function serializeColor(color: ColorValue): DtcgColorValue {
  const channels = color.getChannels();
  return `#${channels.map(channelToHex).join("")}${
    color.hasAlpha() ? channelToHex(color.getAlpha()) : ""
  }`;
}
