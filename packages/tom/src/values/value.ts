import { ColorValue } from "./color";
import { DimensionValue } from "./dimension";
import { JsonValue } from "./json";

export type Value =
  | ColorValue
  | DimensionValue
  | JsonValue;
