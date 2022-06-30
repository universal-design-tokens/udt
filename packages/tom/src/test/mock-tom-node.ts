import { TOMNode } from "../tom-node";

export class MockTOMNode extends TOMNode {
  #isValid = true;

  public setValid(isValid: boolean): void {
    this.#isValid = isValid;
  }

  public isValid() {
    return this.#isValid;
  }
}
