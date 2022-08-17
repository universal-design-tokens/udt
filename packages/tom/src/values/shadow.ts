import { Reference } from "../reference";
import { ColorValue, isColorValue } from "./color";
import { CompositeValue } from "./composite-value";
import { DimensionValue, isDimensionValue } from "./dimension";

export interface IShadowValueProps {
  color: ColorValue | Reference;
  offsetX: DimensionValue | Reference;
  offsetY: DimensionValue | Reference;
  blur: DimensionValue | Reference;
  spread: DimensionValue | Reference;
}

export class ShadowValue extends CompositeValue {
  #color: ColorValue | Reference;
  #offsetX: DimensionValue | Reference;
  #offsetY: DimensionValue | Reference;
  #blur: DimensionValue | Reference;
  #spread: DimensionValue | Reference;

  constructor({
    color,
    offsetX,
    offsetY,
    blur,
    spread,
  }: IShadowValueProps) {
    super();
    this.#color = color;
    this.#offsetX = offsetX;
    this.#offsetY = offsetY;
    this.#blur = blur;
    this.#spread = spread;
  }

  public getColor(): ColorValue | Reference {
    return this.#color;
  }

  public setColor(value: ColorValue | Reference): void {
    if (this._isSuitableValueOrReference(value, isColorValue)) {
      this.#color = value;
    }
    throw new Error(`Cannot set shadow color to a (reference to a) non-color value`);
  }

  public getResolvedColor(): ColorValue {
    return this._getResolvedValue(this.#color, isColorValue);
  }


  public getOffsetX(): DimensionValue | Reference {
    return this.#offsetX;
  }

  public setOffsetX(value: DimensionValue | Reference): void {
    if (this._isSuitableValueOrReference(value, isDimensionValue)) {
      this.#offsetX = value;
    }
    throw new Error(`Cannot set shadow offsetX to a (reference to a) non-dimension value`);
  }

  public getResolvedOffsetX(): DimensionValue {
    return this._getResolvedValue(this.#offsetX, isDimensionValue);
  }

  public getOffsetY(): DimensionValue | Reference {
    return this.#offsetY;
  }

  public setOffsetY(value: DimensionValue | Reference): void {
    if (this._isSuitableValueOrReference(value, isDimensionValue)) {
      this.#offsetY = value;
    }
    throw new Error(`Cannot set shadow offsetY to a (reference to a) non-dimension value`);
  }

  public getResolvedOffsetY(): DimensionValue {
    return this._getResolvedValue(this.#offsetY, isDimensionValue);
  }

  public getBlur(): DimensionValue | Reference {
    return this.#blur;
  }

  public setBlur(value: DimensionValue | Reference): void {
    if (this._isSuitableValueOrReference(value, isDimensionValue)) {
      this.#blur = value;
    }
    throw new Error(`Cannot set shadow blur to a (reference to a) non-dimension value`);
  }

  public getResolvedBlur(): DimensionValue {
    return this._getResolvedValue(this.#blur, isDimensionValue);
  }

  public getSpread(): DimensionValue | Reference {
    return this.#spread;
  }

  public setSpread(value: DimensionValue | Reference): void {
    if (this._isSuitableValueOrReference(value, isDimensionValue)) {
      this.#spread = value;
    }
    throw new Error(`Cannot set shadow blur to a (reference to a) non-dimension value`);
  }

  public getResolvedSpread(): DimensionValue {
    return this._getResolvedValue(this.#spread, isDimensionValue);
  }
}
