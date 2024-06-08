import { Reference } from "./reference.js";
import { resolveReference } from "./resolve-reference.js";
import { MockReferencableNode } from "./test/mock-referencable-node.js";

// Node with a value
const testValue = 42;
const testNode1Ref = new Reference(["node1"]);
const testNode1: MockReferencableNode = {
  value: testValue,
};

// Node which directly references the one with a value
// testNode2 --> testNode1
const testNode2Ref = new Reference(["node2"]);
const testNode2: MockReferencableNode = {
  value: testNode1Ref,
};

// Node which indirectly references the one with a value
// testNode3 --> testNode2 --> testNode1
const testNode3: MockReferencableNode = {
  value: testNode2Ref,
};

// Nodes which create a reference loop
// testNode4 --> ???
const testNode4Ref = new Reference(["node4"]);
const testNode5Ref = new Reference(["node5"]);
const testNode4: MockReferencableNode = {
  value: testNode5Ref,
};
const testNode5: MockReferencableNode = {
  value: testNode4Ref,
};

const testNodes = new Map<Reference, MockReferencableNode>();
testNodes.set(testNode1Ref, testNode1);
testNodes.set(testNode2Ref, testNode2);
testNodes.set(testNode4Ref, testNode4);
testNodes.set(testNode5Ref, testNode5);

const dereference = jest.fn(function (
  _sourceNode: MockReferencableNode,
  reference: Reference
): MockReferencableNode | undefined {
  return testNodes.get(reference);
});

const getValue = jest.fn(function (
  node: MockReferencableNode
): number | Reference {
  return node.value;
});

describe("resolveReference()", () => {
  beforeEach(() => {
    dereference.mockClear();
    getValue.mockClear();
  });

  it("returns property's value if the referenced node has one", () => {
    expect(
      resolveReference(testNode1Ref, testNode2, dereference, getValue)
    ).toBe(testValue);
  });

  it("can follow a chain of reference nodes until it reaches one with an actual value", () => {
    expect(
      resolveReference(testNode2Ref, testNode3, dereference, getValue)
    ).toBe(testValue);
  });

  it("calls the dereference function each time a reference is encountered", () => {
    resolveReference(testNode2Ref, testNode3, dereference, getValue);
    expect(dereference).toHaveBeenCalledTimes(2);
  });

  it("calls the property getter function each time a node is dereferenced", () => {
    resolveReference(testNode2Ref, testNode3, dereference, getValue);
    expect(getValue).toHaveBeenCalledTimes(2);
  });

  it("throws an error if an invalid reference is encountered", () => {
    expect(() =>
      resolveReference(
        new Reference(["nowhere"]),
        testNode1,
        dereference,
        getValue
      )
    ).toThrowError();
  });

  it("throws an error if a reference loop is encountered", () => {
    expect(() =>
      resolveReference(testNode5Ref, testNode4, dereference, getValue)
    ).toThrowError();
  });
});
