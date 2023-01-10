import exp from "constants";
import { DesignToken } from "./design-token";
import { Group, TokenOrGroup } from "./group";
import { Reference } from "./reference";
import { Type } from "./type";

describe("Group", () => {
  const testGroupName = "test group";
  let testGroup: Group;

  beforeEach(() => {
    testGroup = new Group(testGroupName);
  });

  it("initially has no own or inherited type", () => {
    expect(testGroup.getInheritedType()).toBeUndefined();
  });

  it("initially has no children", () => {
    expect(testGroup.hasChildren()).toBe(false);
  });

  it("initial child count is zero", () => {
    expect(testGroup.childCount()).toBe(0);
  });

  it("returns undefined when retrieving a child that does not exist", () => {
    expect(testGroup.getChild("does not exist")).toBeUndefined();
  });

  it("lets you add and retrieve a child", () => {
    const childName = "child";
    const child = new Group(childName);
    testGroup.addChild(child);
    expect(testGroup.getChild(childName)).toBe(child);
  });

  it("sets itself as the parent of a child", () => {
    const child = new Group("child");
    testGroup.addChild(child);
    expect(child.getParent()).toBe(testGroup);
  });

  it("removes child from pre-existing parent when adding it", () => {
    const otherParent = new Group("other parent");
    const child = new Group("child");
    otherParent.addChild(child);
    testGroup.addChild(child);
    expect(otherParent.childCount()).toBe(0);
  });

  it("returns false if you try to remove a non-existent child", () => {
    const notAChild = new Group("not a child");
    expect(testGroup.removeChild(notAChild)).toBe(false);
  });

  it("is initially valid", () => {
    expect(testGroup.isValid()).toBe(true);
  });

  it("with an invalid child is invalid", () => {
    const child = new Group("child");
    // replace the child's isValid() function with
    // a mock one that always returns false
    child.isValid = () => false;

    testGroup.addChild(child);

    expect(testGroup.isValid()).toBe(false);
  });

  it("checks validity of all children when isValid() is called", () => {
    const child1 = new Group("child 1");
    const isValidSpy1 = jest.spyOn(child1, "isValid");

    const child2 = new Group("child 2");
    const isValidSpy2 = jest.spyOn(child2, "isValid");

    testGroup.addChild(child1);
    testGroup.addChild(child2);

    // Check validity, which should call isValid() on child1 & 2
    testGroup.isValid();

    expect(isValidSpy1).toHaveBeenCalled();
    expect(isValidSpy2).toHaveBeenCalled();

    // cleanup
    isValidSpy1.mockRestore();
    isValidSpy2.mockRestore();
  });

  describe("with a child", () => {
    const childName = "child";
    let child: Group;

    beforeEach(() => {
      child = new Group(childName);
      testGroup.addChild(child);
    });

    it("lets you remove a child", () => {
      expect(testGroup.removeChild(child)).toBe(true);
      expect(testGroup.hasChild(childName)).toBe(false);
    });

    it("removes itself as the parent of a removed child", () => {
      testGroup.removeChild(child);
      expect(child.hasParent()).toBe(false);
    });

    it("only adds a child once, even if you use addChild() multiple times", () => {
      testGroup.addChild(child);
      expect(testGroup.childCount()).toBe(1);
    });

    it("lets you replace a child with another that has the same name", () => {
      const child2 = new Group(childName);
      testGroup.addChild(child2);

      expect(testGroup.getChild(childName)).toBe(child2);
    });

    it("removes itself as the parent of a replaced child", () => {
      const child2 = new Group(childName);
      testGroup.addChild(child2);

      expect(child.hasParent()).toBe(false);
    });

    it("lets you check the presence of a child", () => {
      expect(testGroup.hasChild(child)).toBe(true);
    });

    it("lets you check the presence of a child by name", () => {
      expect(testGroup.hasChild(childName)).toBe(true);
    });

    it("lets child inherit its type", () => {
      const testType = Type.COLOR;
      testGroup.setType(testType);
      expect(child.getInheritedType()).toBe(testType);
    });
  });

  describe("with nested child groups and tokens", () => {
    let groupA: Group, groupB: Group;
    let tokenC: DesignToken,
      tokenA1: DesignToken,
      tokenA2: DesignToken,
      tokenB1: DesignToken;
    let allTokens: DesignToken[];

    beforeEach(() => {
      groupA = new Group("group A");
      testGroup.addChild(groupA);

      groupB = new Group("group B");
      testGroup.addChild(groupB);

      tokenC = new DesignToken("token C", 1);
      testGroup.addChild(tokenC);

      tokenA1 = new DesignToken("token A1", 1);
      groupA.addChild(tokenA1);

      tokenA2 = new DesignToken("token A2", 22);
      groupA.addChild(tokenA2);

      tokenB1 = new DesignToken("token B1", 333);
      groupB.addChild(tokenB1);

      allTokens = [tokenC, tokenA1, tokenA2, tokenB1];
    });

    it("can recursively traverse all tokens", () => {
      let tokenCount = 0;
      for (const token of testGroup.traverseTokens()) {
        expect(allTokens.includes(token)).toBe(true);
        tokenCount++;
      }
      expect(tokenCount).toBe(allTokens.length);
    });

    it("can traverse only direct child tokens", () => {
      const groupATokens = [tokenA1, tokenA2];
      let tokenCount = 0;
      for (const token of groupA.traverseTokens(false)) {
        expect(groupATokens.includes(token)).toBe(true);
        tokenCount++;
      }
      expect(tokenCount).toBe(groupATokens.length);
    });

    it("can retrieve a group by its reference", () => {
      const ref = groupA.getReference();
      expect(testGroup.getReferencedNode(ref)).toBe(groupA);
    });

    it("can retrieve a token by its reference", () => {
      const ref = tokenA2.getReference();
      expect(testGroup.getReferencedNode(ref)).toBe(tokenA2);
    });

    it("returns itself for an empty reference", () => {
      const ref = new Reference([]);
      expect(testGroup.getReferencedNode(ref)).toBe(testGroup);
    });

    it("throws an error for reference where an intermediate segment is not a group", () => {
      const ref = new Reference([groupA.getName(), tokenA1.getName(), 'invalid']);
      expect(() => {testGroup.getReferencedNode(ref)}).toThrow(Error);
    });

    it("throws an error for reference pointing to nodes that do not exist", () => {
      const ref = new Reference([groupA.getName(), 'invalid']);
      expect(() => {testGroup.getReferencedNode(ref)}).toThrow(Error);
    });
  });
});
