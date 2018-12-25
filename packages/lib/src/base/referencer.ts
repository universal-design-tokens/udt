/**
 * Interface for classes that can reference other objects, but may not
 * have their referenced object set immediately.
 *
 * Implementing this interface makes them compatible with `DeferredReference`.
 */
export default interface Referencer<T> {
  /**
   * Sets a reference to another object.
   *
   * This method is called by `DeferredReference`, once it is asked
   * to resolve a reference.
   *
   * @param object   The other object that should be referenced.
   */
  setReference(object: T): void;
}
