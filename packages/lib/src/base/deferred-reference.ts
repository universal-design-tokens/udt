import Referencer from './referencer';

export default class DeferredReference<T> {
  public refString: string;
  public prop?: Referencer<T>;

  constructor(refString: string) {
    this.refString = refString;
  }

  resolveReference(object: T) {
    if (this.prop === undefined){
      throw new Error('Cannot resolve reference before the property was set');
    }
    else {
      this.prop.setReference(object);
    }
  }
}
