import { describe, it, expect } from "vitest";
import {
  dimensionUnits1stED,
  isValidDimensionUnit1stED,
} from "./1st-ed/dimension.js";
import {
  Dimension,
  dimensionUnits,
  fromDimension1stED,
  isValidDimension,
  isValidDimensionUnit,
  sanitizeDimension,
  toDimension1stED,
  toPxEquivalent,
  toRemEquivalent,
} from "./dimension.js";
import {
  fromDimension1stEDTo3rdEd,
  isValidDimension3rdED,
  sanitizeDimension3rdED,
} from "./3rd-ed/dimensions.js";

it("re-exports dimensionUnits from 1st ED", () => {
  expect(dimensionUnits).toBe(dimensionUnits1stED);
});

it("re-exports isValidDimensionUnit() from 1st ED", () => {
  expect(isValidDimensionUnit).toBe(isValidDimensionUnit1stED);
});

it("re-exports isValidDimension() from 3rd ED", () => {
  expect(isValidDimension).toBe(isValidDimension3rdED);
});

it("re-exports fromDimension1stED() from 3rd ED", () => {
  expect(fromDimension1stED).toBe(fromDimension1stEDTo3rdEd);
});

it("re-exports sanitizeDimension3rdED() from 3rd ED", () => {
  expect(sanitizeDimension).toBe(sanitizeDimension3rdED);
});

describe("toDimension1stED()", () => {
  it("converts current spec dimension to 1st ED correctly", () => {
    expect(toDimension1stED({ value: 123, unit: "px" })).toEqual("123px");
  });
});

describe("toRemEquivalent()", () => {
  it("converts px dimension to rem equivalent", () => {
    expect(toRemEquivalent({ value: 16, unit: "px" })).toStrictEqual({
      value: 1,
      unit: "rem",
    });
  });

  it("converts px dimension to rem equivalent, with specified default font size", () => {
    expect(toRemEquivalent({ value: 29, unit: "px" }, 29)).toStrictEqual({
      value: 1,
      unit: "rem",
    });
  });

  it("passes through rem dimensions unchanged", () => {
    const remVal: Dimension = {
      value: 1,
      unit: "rem",
    };
    expect(toRemEquivalent(remVal)).toStrictEqual(remVal);
  });
});

describe("toPxEquivalent()", () => {
  it("converts rem dimension to px equivalent", () => {
    expect(toPxEquivalent({ value: 1, unit: "rem" })).toStrictEqual({
      value: 16,
      unit: "px",
    });
  });

  it("converts rem dimension to px equivalent, with specified default font size", () => {
    expect(toPxEquivalent({ value: 1, unit: "rem" }, 29)).toStrictEqual({
      value: 29,
      unit: "px",
    });
  });

  it("passes through px dimensions unchanged", () => {
    const pxVal: Dimension = {
      value: 16,
      unit: "px",
    };
    expect(toPxEquivalent(pxVal)).toStrictEqual(pxVal);
  });
});
