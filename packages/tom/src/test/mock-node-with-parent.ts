import { NodeWithParent } from "../node-with-parent";


export class MockNodeWithParent extends NodeWithParent<number> {
  public parentAssignedMock = jest.fn();
  public parentRemovedMock = jest.fn();

  protected _onParentAssigned(): void {
    this.parentAssignedMock();
  }

  protected _onParentRemoved(): void {
    this.parentRemovedMock();
  }

  public assignParent(parent: number): void {
    NodeWithParent._assignParent(this, parent);
  }

  public removeParent(): void {
    MockNodeWithParent._clearParent(this);
  }
}
