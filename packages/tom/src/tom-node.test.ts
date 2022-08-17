import { isValidName, isValidType, TOMNode } from "./tom-node";
import { allTypes, Type } from "./type";
import { MockTOMNode } from "./test/mock-tom-node";
import { TOMInvalidAssignmentError } from "./exceptions";

describe("isValidName()", () => {
  it("accepts strings that are empty or only contain whitespace", () => {
    const testNames = ["", "  ", "\t\n"];

    testNames.forEach((name) => {
      expect(isValidName(name)).toBe(true);
    });
  });

  it("accepts strings in different scripts", () => {
    const testNames = ["test-token", "DésîgnTökèn", "드사이느"];

    testNames.forEach((name) => {
      expect(isValidName(name)).toBe(true);
    });
  });

  it("accepts strings in that contain $ anywhere but the first character", () => {
    const testNames = [" $", "moneyz$$$"];

    testNames.forEach((name) => {
      expect(isValidName(name)).toBe(true);
    });
  });

  it("rejects any string beginning with $", () => {
    const testNames = ["$test-token", "$", "$$$"];

    testNames.forEach((name) => {
      expect(isValidName(name)).toBe(false);
    });
  });

  it("rejects any string containing periods or curly brackets", () => {
    const testNames = [
      "invalid.name",
      "invalid{name",
      "invalid}name",
      "invalid\nmulti\rline\t.name",
    ];

    testNames.forEach((name) => {
      expect(isValidName(name)).toBe(false);
    });
  });

  it("rejects any non-string values", () => {
    const testNames = [false, null, {}, 42, undefined, []];

    testNames.forEach((name) => {
      expect(isValidName(name)).toBe(false);
    });
  });
});

describe("isValidType()", () => {
  it("accepts any of the permitted type names", () => {
    allTypes.forEach((type) => {
      expect(isValidType(type)).toBe(true);
    });
  });

  it("rejects strings that are not valid type names", () => {
    const fakeTypes = ["colour", " color", "Color", ""];

    fakeTypes.forEach((type) => {
      expect(isValidType(type)).toBe(false);
    });
  });
});

describe("TOMNode", () => {
  const testNodeName = "test-node";

  it("throws a TOMInvalidAssignmentError when constructed with an invalid name", () => {
    expect(() => {
      new MockTOMNode("$invalidName");
    }).toThrow(TOMInvalidAssignmentError);
  });

  it("throws a TOMInvalidAssignmentError when constructed with an invalid type", () => {
    expect(() => {
      new MockTOMNode(testNodeName, { type: "not-a-type" as any });
    }).toThrow(TOMInvalidAssignmentError);
  });

  it("throws a TOMInvalidAssignmentError when constructed with an invalid description", () => {
    expect(() => {
      new MockTOMNode(testNodeName, { description: 42 as any });
    }).toThrow(TOMInvalidAssignmentError);
  });

  describe("constructed with a valid name", () => {
    let testNode: TOMNode;

    beforeEach(() => {
      testNode = new MockTOMNode(testNodeName);
    });

    it("has a name", () => {
      expect(testNode.getName()).toBe(testNodeName);
    });

    it("has no type", () => {
      expect(testNode.getType()).toBeUndefined();
    });

    it("has no description", () => {
      expect(testNode.getDescription()).toBeUndefined();
    });

    it("let's you change its name", () => {
      const newName = "new-name";
      testNode.setName(newName);
      expect(testNode.getName()).toBe(newName);
    });

    it("throws a TOMInvalidNameError if you set an invalid name", () => {
      expect(() => {
        testNode.setName("$invalidName");
      }).toThrow(TOMInvalidAssignmentError);
    });

    it("let's you set a valid type", () => {
      const type = Type.BORDER;
      testNode.setType(type);
      expect(testNode.getType()).toBe(type);
    });

    it("throws a TOMInvalidAssignmentError if you set an invalid type", () => {
      expect(() => {
        testNode.setType("invalidType" as any);
      }).toThrow(TOMInvalidAssignmentError);
    });

    it("let's you set a valid description", () => {
      const description = "Hello world!";
      testNode.setDescription(description);
      expect(testNode.getDescription()).toBe(description);
    });

    it("throws a TOMInvalidAssignmentError if you set an invalid description", () => {
      expect(() => {
        testNode.setDescription(666 as any);
      }).toThrow(TOMInvalidAssignmentError);
    });

    it("has no parent", () => {
      expect(testNode.getParent()).toBeUndefined();
    });

    it("has no top parent", () => {
      expect(testNode.getTopParent()).toBeUndefined();
    });

    it("is the root", () => {
      expect(testNode.getRoot()).toBe(testNode);
    });
  });

  describe("constructed with common props", () => {
    const testDescription = "bla bla bla";
    const testType = Type.CUBIC_BEZIER;
    let testNode: TOMNode;

    beforeEach(() => {
      testNode = new MockTOMNode(testNodeName, {
        description: testDescription,
        type: testType,
      });
    });

    it("has a type", () => {
      expect(testNode.getType()).toBe(testType);
    });

    it("has a description", () => {
      expect(testNode.getDescription()).toBe(testDescription);
    });
  });
});
