import { describe, it, expect } from "vitest";
import { MockCompositeValue } from "../test/mock-composite-value.js";

describe("CompositeValue", () => {
  describe("_isSuitableValueOrReference()", () => {
    it("accepts valid value", () => {
      const testComposite = new MockCompositeValue();
      expect(testComposite.isSuitableValueOrReference(42)).toBe(true);
    });

    it("rejects an invalid value", () => {
      const testComposite = new MockCompositeValue();
      expect(testComposite.isSuitableValueOrReference("not a number")).toBe(
        false
      );
    });
  });
});
