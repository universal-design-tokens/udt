import { Group } from "./group";

export class RootGroup extends Group {

  constructor (props: any = {}) {
    super('', props);
  }


  public getPath() {
    // Filename is not included in paths
    return [];
  }
}
