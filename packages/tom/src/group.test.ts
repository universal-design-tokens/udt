import { DesignToken } from "./design-token";
import { Group, TokenOrGroup } from "./group";
import { Type } from "./type";

describe('Group', () => {
  const testGroupName = 'test group';
  let testGroup: Group;

  beforeEach(() => {
    testGroup = new Group(testGroupName);
  });

  it('initially has no own or inherited type', () => {
    expect(testGroup.getInheritedType()).toBeUndefined();
  });

  it('initially has no children', () => {
    expect(testGroup.hasChildren()).toBe(false);
  });

  it('initial child count is zero', () => {
    expect(testGroup.childCount()).toBe(0);
  });

  it('returns undefined when retrieving a child that does not exist', () => {
    expect(testGroup.getChild('does not exist')).toBeUndefined();
  });

  it('lets you add and retrieve a child', () => {
    const childName = 'child';
    const child = new Group(childName);
    testGroup.addChild(child);
    expect(testGroup.getChild(childName)).toBe(child);
  });

  it('sets itself as the parent of a child', () => {
    const child = new Group('child');
    testGroup.addChild(child);
    expect(child.getParent()).toBe(testGroup);
  });

  it('removes child from pre-existing parent when adding it', () => {
    const otherParent = new Group('other parent');
    const child = new Group('child');
    otherParent.addChild(child);
    testGroup.addChild(child);
    expect(otherParent.childCount()).toBe(0);
  });

  it('returns false if you try to remove a non-existent child', () => {
    const notAChild = new Group('not a child');
    expect(testGroup.removeChild(notAChild)).toBe(false);
  });

  describe('with a child', () => {
    const childName = 'child';
    let child: Group;

    beforeEach(() => {
      child = new Group(childName);
      testGroup.addChild(child);
    });

    it('lets you remove a child', () => {
      expect(testGroup.removeChild(child)).toBe(true);
      expect(testGroup.hasChild(childName)).toBe(false);
    });

    it('removes itself as the parent of a removed child', () => {
      testGroup.removeChild(child);
      expect(child.hasParent()).toBe(false);
    });

    it('only adds a child once, even if you use addChild() multiple times', () => {
      testGroup.addChild(child);
      expect(testGroup.childCount()).toBe(1);
    });

    it('lets you replace a child with another that has the same name', () => {
      const child2 = new Group(childName);
      testGroup.addChild(child2);

      expect(testGroup.getChild(childName)).toBe(child2);
    });

    it('removes itself as the parent of a replaced child', () => {
      const child2 = new Group(childName);
      testGroup.addChild(child2);

      expect(child.hasParent()).toBe(false);
    });

    it('lets you check the presence of a child', () => {
      expect(testGroup.hasChild(child)).toBe(true);
    });

    it('lets you check the presence of a child by name', () => {
      expect(testGroup.hasChild(childName)).toBe(true);
    });

    it('lets child inherit its type', () => {
      const testType = Type.COLOR;
      testGroup.setType(testType);
      expect(child.getInheritedType()).toBe(testType);
    });
  });
});
