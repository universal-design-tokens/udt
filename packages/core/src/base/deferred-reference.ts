export default class DeferredReference {
  constructor(refString) {
    this.refString = refString;
  }

  setProperty(prop) {
    this.prop = prop;
  }

  resolveReference(token) {
    this.prop.setRefValue(token);
  }
}
