import { ExtensionsMap, isValidName, isValidType, TOMNode } from "./tom-node";
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

  describe("constructed with only a valid name", () => {
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

    it("lets you change its name", () => {
      const newName = "new-name";
      testNode.setName(newName);
      expect(testNode.getName()).toBe(newName);
    });

    it("throws a TOMInvalidNameError if you set an invalid name", () => {
      expect(() => {
        testNode.setName("$invalidName");
      }).toThrow(TOMInvalidAssignmentError);
    });

    it("lets you set a valid type", () => {
      const type = Type.BORDER;
      testNode.setType(type);
      expect(testNode.getType()).toBe(type);
    });

    it("throws a TOMInvalidAssignmentError if you set an invalid type", () => {
      expect(() => {
        testNode.setType("invalidType" as any);
      }).toThrow(TOMInvalidAssignmentError);
    });


    it("lets you clear the type", () => {
      // set a valid type
      testNode.setType(Type.BORDER);
      // now clear it
      testNode.setType(undefined);
      expect(testNode.getType()).toBe(undefined);
    });

    it("lets you set a valid description", () => {
      const description = "Hello world!";
      testNode.setDescription(description);
      expect(testNode.getDescription()).toBe(description);
    });

    it("throws a TOMInvalidAssignmentError if you set an invalid description", () => {
      expect(() => {
        testNode.setDescription(666 as any);
      }).toThrow(TOMInvalidAssignmentError);
    });

    it("lets you clear the description", () => {
      // set a valid description
      testNode.setDescription("Hello world");
      // now clear it
      testNode.setDescription(undefined);
      expect(testNode.getDescription()).toBe(undefined);
    });

    it("returns undefined as its parent", () => {
      expect(testNode.getParent()).toBeUndefined();
    });

    it("returns undefined as its top parent", () => {
      expect(testNode.getTopParent()).toBeUndefined();
    });

    it("returns itself as the root", () => {
      expect(testNode.getRoot()).toBe(testNode);
    });

    it("has an empty path", () => {
      expect(testNode.getPath()).toStrictEqual([]);
    });

    it("has no parent", () => {
      expect(testNode.hasParent()).toBe(false);
    });

    it("has no extensions", () => {
      expect(testNode.hasExtensions()).toBe(false);
    });

    it("lets you set and get an extension", () => {
      const extKey = 'design.udt.test';
      const extVal = 42;
      testNode.setExtension(extKey, extVal);
      expect(testNode.getExtension(extKey)).toBe(extVal);
    });

    it("lets you set multiple extensions at once", () => {
      const extensions: ExtensionsMap = {
        'design.udt.test': 42,
        'design.udt.test2': false,
        'design.udt.test3': {},
      };
      testNode.setExtensions(extensions);
      for (const extKey of Object.keys(extensions)) {
        expect(testNode.getExtension(extKey)).toBe(extensions[extKey]);
      }
    });

  });

  describe("constructed with common props", () => {
    const testDescription = "bla bla bla";
    const testType = Type.CUBIC_BEZIER;
    const testExtensions: ExtensionsMap = {
      'design.udt.test': 42,
      'design.udt.test2': false,
      'design.udt.test3': {},
    };
    let testNode: TOMNode;

    beforeEach(() => {
      testNode = new MockTOMNode(testNodeName, {
        description: testDescription,
        type: testType,
        extensions: testExtensions,
      });
    });

    it("has the correct type", () => {
      expect(testNode.getType()).toBe(testType);
    });

    it("has the correct description", () => {
      expect(testNode.getDescription()).toBe(testDescription);
    });

    it("has the correct extensions", () => {
      for (const extKey of Object.keys(testExtensions)) {
        expect(testNode.getExtension(extKey)).toBe(testExtensions[extKey]);
      }
    });
  });

  describe("with some extensions", () => {
    const testExtName = "design.udt.test";
    const testExtensions: ExtensionsMap = {
      [testExtName]: 42,
      'design.udt.test2': false,
      'design.udt.test3': {},
    };
    let testNode: TOMNode;

    beforeEach(() => {
      testNode = new MockTOMNode(testNodeName);
      testNode.setExtensions(testExtensions);
    });

    it("correctly reports that is has the given extensions", () => {
      for (const extKey of Object.keys(testExtensions)) {
        expect(testNode.hasExtension(extKey)).toBe(true);
      }
    });

    it("correctly reports the absernce of an extension", () => {
      expect(testNode.hasExtension('does.not.exist')).toBe(false);
    });

    it("correctly reports that it has some extensions", () => {
      expect(testNode.hasExtensions()).toBe(true);
    });

    it("lets you delete an extension", () => {
      expect(testNode.deleteExtension(testExtName)).toBe(true);
      expect(testNode.hasExtension(testExtName)).toBe(false);
    });

    it("returns false when you try to delete an extension it does not have", () => {
      expect(testNode.deleteExtension("does.not.exist")).toBe(false);
    });

    it("lets you clear all extensions", () => {
      testNode.clearExtensions();
      expect(testNode.hasExtensions()).toBe(false);
    });

    it("lets you iterate over extensions", () => {
      for(const [key, extension] of testNode.extensions()) {
        expect(extension).toBe(testExtensions[key]);
      }
    });
  });

  describe("with some parents", () => {
    const testPath = ['parent', testNodeName]
    let testNode: TOMNode;
    let testGrandParent: TOMNode;

    beforeEach(() => {
      const grandParent = new MockTOMNode('grand parent');
      const parent = new MockTOMNode(testPath[0]);
      const child = new MockTOMNode(testNodeName);

      parent.setParent(grandParent);
      child.setParent(parent);

      testNode = child;
      testGrandParent = grandParent;
    });

    it("can find the top parent", () => {
      expect(testNode.getTopParent()).toBe(testGrandParent);
    });

    it("reports the top parent as the root", () => {
      expect(testNode.getRoot()).toBe(testGrandParent);
    });

    it("reports the correct path", () => {
      expect(testNode.getPath()).toStrictEqual(testPath);
    });
  });
});
