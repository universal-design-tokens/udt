import { RootGroup } from "./root-group";

describe('RootGroup', () => {
  it('has an empty name', () => {
    const testRoot = new RootGroup();
    expect(testRoot.getName()).toBe('');
  });
});
