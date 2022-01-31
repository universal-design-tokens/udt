import { Group } from "./group";

export class RootGroup extends Group {


  public getPath() {
    // Filename is not included in paths
    return [];
  }
}
