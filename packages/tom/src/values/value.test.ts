import { describe, it, expect } from "vitest";
import { Type } from "../type.js";
import { isValue, Value } from "./value.js";

class MockValue extends Value {
  public type = Type.BORDER;
}

describe("isValue()", () => {
  it("identifies Value instances as such", () => {
    expect(isValue(new MockValue())).toBe(true);
  });

  it("identifies non-Value inputs as such", () => {
    expect(isValue(666)).toBe(false);
  });
});
