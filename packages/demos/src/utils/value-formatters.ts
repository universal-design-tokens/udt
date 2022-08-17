import {
  ColorValue,
  DimensionValue,
  JsonValue,
  Reference,
  ShadowValue,
  Type,
  Value,
} from "@udt/tom";
import { indentable, Indentable, tabWidth } from "./text-formatting";
import chalk from "chalk";

const data = chalk.yellowBright.bold;
const keyword = chalk.greenBright;
const syntax = chalk.yellow.dim;

export function formatReference(reference: Reference): string {
  return syntax("{") + data(reference.path.join(syntax("."))) + syntax("}");
}

function round(value: number): string {
  return value.toFixed(2);
}

export function formatColor(value: ColorValue): Indentable {
  return indentable(
    syntax(`{`),
    indentable(
      keyword("channels") +
        syntax(": [") +
        data(value.getChannels().map(round).join(syntax(", "))) +
        syntax("]")
    ),
    value.hasAlpha() ? indentable(` alpha: ${round(value.getAlpha())}`) : null,
    syntax(`}`)
  );
}

export function formatDimension(value: DimensionValue): string {
  return data(`${value.getAmount()}${value.getUnit()}`);
}

export function formatShadow(value: ShadowValue): Indentable {
  return indentable(
    keyword(`color`) + syntax(`:` ),
    formatColor(value.getResolvedColor()),
    keyword(`offsetX`)+ syntax(`: `) + formatDimension(value.getResolvedOffsetX()),
    keyword(`offsetY`)+ syntax(`: `) + formatDimension(value.getResolvedOffsetY()),
    keyword(`blur`)+ syntax(`: `) + formatDimension(value.getResolvedBlur()),
    keyword(`spread`)+ syntax(`: `) + formatDimension(value.getResolvedSpread())
  );
}

export function formatJSON(value: JsonValue): string {
  return data(JSON.stringify(value, undefined, tabWidth));
}

export function formatValue(value: Value, type: Type): string | Indentable {
  switch (type) {
    case Type.COLOR: {
      return formatColor(value as ColorValue);
    }

    case Type.DIMENSION: {
      return formatDimension(value as DimensionValue);
    }

    case Type.SHADOW: {
      return formatShadow(value as ShadowValue);
    }

    default: {
      return formatJSON(value as JsonValue);
    }
  }
}
