import { Group } from "./group";
import { TOMNodeCommonConstructorProps } from "./tom-node";

export class RootGroup extends Group {

  constructor (props: TOMNodeCommonConstructorProps = {}) {
    super('', props);
  }
}
