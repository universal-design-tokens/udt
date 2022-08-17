import { ColorValue } from "./color";
import { DimensionValue } from "./dimension";
import { ShadowValue } from "./shadow";
import { JsonValue } from "./json";

export type Value =
  | ColorValue
  | DimensionValue
  | ShadowValue
  | JsonValue;
