import { Type } from "../type.js";
import { Value } from "./value.js";

export type DimensionUnit = 'rem' | 'px';

export class DimensionValue extends Value {
  readonly type = Type.DIMENSION;

  #amount: number;
  #unit: DimensionUnit;

  constructor({ amount, unit }: { amount: number, unit: DimensionUnit }) {
    super();
    this.#amount = amount;
    this.#unit = unit;
  }

  getAmount(): number {
    return this.#amount;
  }

  setAmount(value: number): void {
    if (typeof value !== 'number') {
      throw new Error('Invalid dimension value');
    }
    this.#amount = value;
  }

  getUnit(): DimensionUnit {
    return this.#unit;
  }

  setUnit(unit: DimensionUnit): void {
    if (!['rem', 'px'].includes(unit)) {
      throw new Error('Invalid dimension unit');
    }
  }

  getPxEquivalent(pxPerRem: number = 16): number {
    if (this.#unit === 'rem') {
      return this.#amount * pxPerRem;
    }
    else {
      return this.#amount;
    }
  }
}

export function isDimensionValue(value: unknown): value is DimensionValue {
  return value instanceof DimensionValue;
}
