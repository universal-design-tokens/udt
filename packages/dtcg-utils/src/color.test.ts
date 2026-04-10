import { describe, it, expect } from "vitest";
import {
  colorSpaces,
  fromColor1stED,
  isValidColor,
  isValidColorComponents,
  isValidColorSpace,
  sanitizeColor,
} from "./color.js";
import {
  colorSpaces3rdED,
  fromColor1stEDTo3rdEd,
  isValidColor3rdED,
  isValidColorComponents3rdED,
  isValidColorSpace3rdED,
  sanitizeColor3rdED,
} from "./3rd-ed/color.js";

it("re-exports colorSpaces from 3rd ED", () => {
  expect(colorSpaces).toBe(colorSpaces3rdED);
});

it("re-exports isValidColorSpace() from 3rd ED", () => {
  expect(isValidColorSpace).toBe(isValidColorSpace3rdED);
});

it("re-exports isValidColorComponents() from 3rd ED", () => {
  expect(isValidColorComponents).toBe(isValidColorComponents3rdED);
});

it("re-exports isValidColor() from 3rd ED", () => {
  expect(isValidColor).toBe(isValidColor3rdED);
});

it("re-exports fromColor1stED() from 3rd ED", () => {
  expect(fromColor1stED).toBe(fromColor1stEDTo3rdEd);
});

it("re-exports sanitizeColor() from 3rd ED", () => {
  expect(sanitizeColor).toBe(sanitizeColor3rdED);
});
