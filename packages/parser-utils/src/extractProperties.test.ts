import { describe, it, expect } from "vitest";
import { extractProperties } from "./extractProperties.js";

describe("extractProperties()", () => {
  it("extracts the specified properties and their values", () => {
    const extractResult = extractProperties(
      { foo: 42, bar: 13, baz: 666, quux: 0 },
      ["foo", "baz"]
    );
    expect(extractResult.extracted).toStrictEqual({ foo: 42, baz: 666 });
  });

  it("extracts the properties matching a RegEx and their values", () => {
    const extractResult = extractProperties(
      { foo: 42, bar: 13, baz: 666, quux: 0 },
      [/^ba/]
    );
    expect(extractResult.extracted).toStrictEqual({ bar: 13, baz: 666 });
  });

  it("returns non-extracted properties", () => {
    const extractResult = extractProperties(
      { foo: 42, bar: 13, baz: 666, quux: 0 },
      ["foo", "baz"]
    );
    expect(extractResult.rest).toStrictEqual({ bar: 13, quux: 0 });
  });

  it("ignores props to extract that are not present in input object", () => {
    const extractResult = extractProperties({ foo: 42 }, ["baz"]);
    expect(extractResult.extracted).toStrictEqual({});
  });
});
