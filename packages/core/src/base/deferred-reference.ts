
import Token from './token';

export default class DeferredReference {
  public refString: string;
  // public prop?: TokenReferrer<T>;

  constructor(refString: string) {
    this.refString = refString;
  }

  resolveReference(token: T) {
    // if (this.prop === undefined){
    //   throw new Error('Cannot resolve reference before the property was set');
    // }
    // else {
    //   this.prop.setReferencedToken(token);
    // }
  }
}
