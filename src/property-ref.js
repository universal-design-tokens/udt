class PropertyRef {
  constructor(refToken, propName) {
    this.refToken = refToken;
    this.propName = propName;
  }

  getValue() {
    return this.refToken[this.propName];
  }
}

export default PropertyRef;
