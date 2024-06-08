import { MockNodeWithParent } from "./test/mock-node-with-parent.js";

describe('NodeWithParent', () => {
  it('getParent() returns the set parent', () => {
    const testNode = new MockNodeWithParent();
    testNode.assignParent(42);
    expect(testNode.getParent()).toBe(42);
  });

  it('getParent() return undefined when the parent was removed', () => {
    const testNode = new MockNodeWithParent();
    testNode.assignParent(42);
    testNode.removeParent();
    expect(testNode.getParent()).toBeUndefined();
  });

  it('calls _onParentAssigned() when a parent is assigned', () => {
    const testNode = new MockNodeWithParent();
    testNode.assignParent(42);
    expect(testNode.parentAssignedMock).toHaveBeenCalled();
  });

  it('calls _onParentAssigned() when a parent is assigned', () => {
    const testNode = new MockNodeWithParent();
    testNode.assignParent(42);
    testNode.removeParent();
    expect(testNode.parentRemovedMock).toHaveBeenCalled();
  });

});
