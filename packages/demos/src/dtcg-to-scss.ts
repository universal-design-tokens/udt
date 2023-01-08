import {
  ColorValue,
  DesignToken,
  DimensionValue,
  isCompositeValue,
  isReference,
  isValue,
  Reference,
  ShadowValue,
  TokenValue,
  Type,
} from "@udt/tom";
import { parseFile } from "@udt/dtcg-parser";
import { readJsonFile, dtcgDevExampleFile } from "./utils/file";
import kebabcase from "lodash.kebabcase";
import { getArgs } from "./utils/cli-args";

const resolveReferences = false;

function pathToScssVariable(path: string[]): string {
  return `$${path
    .map((name) => name.trim())
    .map(kebabcase)
    .join("-")}`;
}

// Reference helper

function referenceToSassVar(reference: Reference): string {
  return pathToScssVariable(reference.path);
}

// Color helpers

function channelToHex(value: number): string {
  return Math.round(value * 255)
    .toString(16)
    .padStart(2, "0");
}

function colorToCssValue(color: ColorValue): string {
  const channels = color.getChannels();
  return `#${channels.map(channelToHex).join("")}${
    color.hasAlpha() ? channelToHex(color.getAlpha()) : ""
  }`;
}

// Dimension helpers

function dimensionToCssValue(dimension: DimensionValue): string {
  return `${dimension.getAmount()}${dimension.getUnit()}`;
}

// Shadow helpers

function shadowToCssValue(shadow: ShadowValue, resolveReferences: boolean): string {
  const offsetX = resolveReferences
    ? dimensionToCssValue(shadow.getResolvedOffsetX())
    : toScssValue(shadow.getOffsetX(), resolveReferences);
  const offsetY = resolveReferences
    ? dimensionToCssValue(shadow.getResolvedOffsetY())
    : toScssValue(shadow.getOffsetY(), resolveReferences);
  const blur = resolveReferences
    ? dimensionToCssValue(shadow.getResolvedBlur())
    : toScssValue(shadow.getBlur(), resolveReferences);
  const spread = resolveReferences
    ? dimensionToCssValue(shadow.getResolvedSpread())
    : toScssValue(shadow.getSpread(), resolveReferences);
  const color = resolveReferences
    ? colorToCssValue(shadow.getResolvedColor())
    : toScssValue(shadow.getColor(), resolveReferences);

  return `${offsetX} ${offsetY} ${blur} ${spread} ${color}`;
}

// Generate right-hand side value

function toScssValue(
  valueOrReference: TokenValue | Reference,
  resolveReferences: boolean
): string {
  if (isReference(valueOrReference)) {
    return referenceToSassVar(valueOrReference);
  }
  return toCssValue(valueOrReference, resolveReferences);
}

function toCssValue(value: TokenValue, resolveReferences: boolean): string {
  if (isValue(value) || isCompositeValue(value)) {
    switch (value.type) {
      case Type.COLOR: {
        return colorToCssValue(value as ColorValue);
      }

      case Type.DIMENSION: {
        return dimensionToCssValue(value as DimensionValue);
      }

      case Type.SHADOW: {
        return shadowToCssValue(value as ShadowValue, resolveReferences);
      }

      default: {
        throw new Error(`Unsupported token type "${value.type}"`);
      }
    }
  } else {
    return "" + value;
  }
}

// Generate Scss statement

function tokenToScss(token: DesignToken, resolveReferences: boolean): string {
  const comment =
    token.getDescription() === undefined
      ? ""
      : `// ${token.getDescription()}\n`;
  return `${comment}${pathToScssVariable(token.getPath())}: ${toScssValue(
    token.getValue(resolveReferences),
    resolveReferences
  )};`;
}

// Convert DTCG --> Scss

function parseTokenFileAndOutputScss(path: string, resolveReferences: boolean): void {
  console.log(path, resolveReferences);
  const data = readJsonFile(path);
  const rootGroup = parseFile(data);

  for (const token of rootGroup.traverseTokens()) {
    console.log(tokenToScss(token, resolveReferences), "\n");
  }
}

const args = getArgs();
let inputFile: string | undefined, preserveReferences: boolean | undefined;

if (args[0] === '-p') {
  inputFile = args[1];
  preserveReferences = true;
}
else {
  inputFile = args[0];
  preserveReferences = false;
}

parseTokenFileAndOutputScss(inputFile || dtcgDevExampleFile, !preserveReferences);
