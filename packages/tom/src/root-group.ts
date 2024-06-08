import { Group } from "./group.js";
import { TOMNodeCommonConstructorProps } from "./tom-node.js";

export class RootGroup extends Group {

  constructor (props: TOMNodeCommonConstructorProps = {}) {
    super('', props);
  }
}
