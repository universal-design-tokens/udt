import { describe, it, expect } from "vitest";
import { RootGroup } from "./root-group.js";

describe("RootGroup", () => {
  it("has an empty name", () => {
    const testRoot = new RootGroup();
    expect(testRoot.getName()).toBe("");
  });
});
