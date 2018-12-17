import Referencer from './referencer';

/**
 * Function that, given an object will retrieve a Property instance
 * owned by that object.
 */
export type PropertyGetter<V, T> = (object: T) => Property<V, T>;


/**
 * A Property that may either have a value or reference to an object
 * which itself has a Property instance.
 */
export default class Property<V, T> implements Referencer<T> {
  private _value?: V;
  private _objRef?: T;

  /**
   * Constructs a new property instance.
   *
   * @param getReferencedProperty A function that returns the corresponding
   *                              Property from a referenced object.
   */
  constructor(
    private getReferencedProperty: PropertyGetter<V, T>
  ) {}

  /**
   * Checks whether this property is a reference to an object.
   */
  isReference(): this is ReferenceProperty<V, T> {
    return this._objRef !== undefined;
  }

  /**
   * Checks whether this property ultimately references a certain
   * object.
   *
   * Property references can be chained, so this method will
   * recursively follow the chain of property references until
   * it either finds one that references the given object or it
   * reaches the end of the chain (i.e. a property that has is
   * not a reference).
   *
   * @param object   The object to search for.
   */
  references(object: T): boolean {
    const objectProp = this.getReferencedProperty(object);
    return this.referencesProperty(objectProp);
  }

  /**
   * Checks whether this property ultimately references another
   * property.
   *
   * @param otherProp  The other property to search for.
   */
  private referencesProperty(otherProp: Property<V, T>): boolean {
    const referencedObj = this._objRef;
    if (referencedObj === undefined) {
      return false;
    } else {
      const referencedProp = this.getReferencedProperty(referencedObj);
      if (referencedProp === otherProp) {
        return true;
      }
      else {
        return referencedProp.referencesProperty(otherProp);
      }
    }
  }

  /**
   * Sets another object, which itself contains a Property, to be the source
   * of this property's value.
   *
   * This will clear any value this property has.
   *
   * @param object   The other object that should be referenced.
   */
  setReference(object: T) {
    const refObjectProp = this.getReferencedProperty(object);
    if ( refObjectProp === this || refObjectProp.referencesProperty(this) ) {
      throw new Error('Cyclical reference detected. An object cannot reference itself.');
    }
    this._objRef = object;
    delete this._value;
  }

  /**
   * Sets this property's value.
   *
   * This will clear any reference to another property that
   * this property has.
   *
   * @param newValue  The new value for this property.
   */
  setValue(newValue?: V) {
    this._value = newValue;
    delete this._objRef;
  }

  /**
   * Retrieves this property's fully de-referenced value.
   *
   * If this property has its own value, it will be returned.
   * If this property references an object, then the value of the
   * corresponding property of that object will be returned
   * (potentially recursing along the reference chain, if necessary).
   */
  getValue(): V | undefined {
    if ( this._objRef !== undefined ) {
      // Grab the ref's value
      return this.getReferencedProperty(this._objRef).getValue();
    }
    else {
      return this._value;
    }
  }

  /**
   * Retrieves the object being referenced by this property, if any.
   */
  getReference(): T | undefined {
    return this._objRef;
  }
}

interface ReferenceProperty<V, T> extends Property<V, T> {
  isValue(): false;
  getValue(): undefined;
  getReference(): T;
}
