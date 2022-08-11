import { ColorValue, DimensionValue, JsonValue, Reference, ShadowValue, Type, Value } from "@udt/tom";
import { indentable, Indentable, tabWidth } from "./text-formatting";

export function formatReference(reference: Reference): string {
  return `{${reference.path.join('.')}}`;
}

export function formatColor(value: ColorValue): Indentable {
  return indentable(
    `{`,
    indentable(`channels: [${value.getChannels().join(', ')}]`),
    value.hasAlpha() ? indentable(` alpha: ${value.getAlpha()}`) : null,
    `}`
  );
}

export function formatDimension(value: DimensionValue): string {
  return `${value.getAmount()}${value.getUnit()}`;
}

export function formatShadow(value: ShadowValue): Indentable {
  return indentable(
    `color:`,
    formatColor(value.getResolvedColor()),
    `offsetX: ${formatDimension(value.getResolvedOffsetX())}`,
    `offsetY: ${formatDimension(value.getResolvedOffsetY())}`,
    `blur: ${formatDimension(value.getResolvedBlur())}`,
    `spread: ${formatDimension(value.getResolvedSpread())}`,
  );
};

export function formatJSON(value: JsonValue): string {
  return JSON.stringify(value, undefined, tabWidth);
}

export function formatValue(value: Value, type: Type): string | Indentable {
  switch(type) {
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
      return JSON.stringify(value);
    }
  }
}
