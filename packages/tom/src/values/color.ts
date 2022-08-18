import { Type } from "../type";
import { Value } from "./value";

export enum ColorSpace {
  SRGB = 'sRGB'
}

type ColorChannels = [number, number, number];

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

export class ColorValue extends Value {
  readonly type = Type.COLOR;

  #channels: ColorChannels;
  #alpha: number | undefined;

  constructor({ channels, alpha}: { channels: ColorChannels, alpha?: number }) {
    super();
    this.#channels = channels;
    this.#alpha = alpha;
  }

  getChannels(): ColorChannels {
    return this.#channels;
  }

  setChannels(channels: ColorChannels): void {
    this.#channels = channels;
  }

  hasAlpha(): boolean {
    return this.#alpha !== undefined;
  }

  getAlpha(): number {
    return this.hasAlpha() ? this.#alpha! : 1;
  }

  setAlpha(alpha: number | undefined): void {
    this.#alpha = alpha === undefined ? undefined : clamp(0, alpha, 1);
  }

  getColorSpace(): ColorSpace {
    return ColorSpace.SRGB;
  }
}

export function isColorValue(value: unknown): value is ColorValue {
  return value instanceof ColorValue;
}
