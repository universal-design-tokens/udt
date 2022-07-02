import { isShadow, ShadowValue } from "./shadow";

describe("isShadow()", () => {
  it("accepts a valid shadow value", () => {
    const testValue: ShadowValue = {
      color: "#123456",
      offsetX: "0.5rem",
      offsetY: "0.5rem",
      blur: "1rem",
      spread: "0rem",
    };
    expect(isShadow(testValue)).toBe(true);
  });

  it("accepts a shadow whose sub-values are references", () => {
    const testValue: ShadowValue = {
      color: "{path.to.other.token}",
      offsetX: "{path.to.other.token}",
      offsetY: "{path.to.other.token}",
      blur: "{path.to.other.token}",
      spread: "{path.to.other.token}",
    };
    expect(isShadow(testValue)).toBe(true);
  });

  it("rejects a shadow that has invalid sub-values", () => {
    const testValues = [
      {
        color: null, // not a valid color
        offsetX: "0.5rem",
        offsetY: "0.5rem",
        blur: "1rem",
        spread: "0rem",
      },
      {
        color: "#123456",
        offsetX: null, // not a valid dimension
        offsetY: "0.5rem",
        blur: "1rem",
        spread: "0rem",
      },
      {
        color: "#123456",
        offsetX: "0.5rem",
        offsetY: null, // not a valid dimension
        blur: "1rem",
        spread: "0rem",
      },
      {
        color: "#123456",
        offsetX: "0.5rem",
        offsetY: "0.5rem",
        blur: null, // not a valid dimension
        spread: "0rem",
      },
      {
        color: "#123456",
        offsetX: "0.5rem",
        offsetY: "0.5rem",
        blur: "1rem",
        spread: null, // not a valid dimension
      },
    ];

    testValues.forEach((testValue) => {
      expect(isShadow(testValue)).toBe(false);
    });
  });

  it("rejects shadow objects with extraneous properties", () => {
    const testValue = {
      color: "#123456",
      offsetX: "0.5rem",
      offsetY: "0.5rem",
      blur: "1rem",
      spread: "0rem",
      unSupported: 42,
    };
    expect(isShadow(testValue)).toBe(false);
  });

  it("rejects shadow objects with missing sub-values", () => {
    const testValue = {
      color: "#123456",
      offsetX: "0.5rem",
      offsetY: "0.5rem",
      blur: "1rem",
      // missing: spread
    };
    expect(isShadow(testValue)).toBe(false);
  });

  it("rejects values that are non-objects", () => {
    const testValues = [null, 666, false, undefined, [], function () {}];
    testValues.forEach((testValue) => {
      expect(isShadow(testValue)).toBe(false);
    });
  });
});
