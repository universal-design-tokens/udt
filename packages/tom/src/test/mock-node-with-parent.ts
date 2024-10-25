import { vi } from "vitest";
import { NodeWithParent } from "../node-with-parent.js";

export class MockNodeWithParent extends NodeWithParent<number> {
  public parentAssignedMock = vi.fn();
  public parentRemovedMock = vi.fn();

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
