# @udt/parser-utils

## 0.2.0

### Minor Changes

- 7644f9a: BREAKING CHANGE: `ParseGroupDataFn` can no longer return an `addChild` function. Instead, you should now provide an `addChildToGroup` function in your parser config.
- 7644f9a: BREAKING CHANGE: `parseData()` may now return `undefined` (happens if no `parseGroupData` function is set in the config).
- 7644f9a: BREAKING CHANGE: `extractProperties()` now returns an object containing unextract properties and their values, instead of an array of unextracted property names.

## 0.1.0

### Minor Changes

- aa0e5ce: Initial release of `@udt/parser-utils` package.

### Patch Changes

- aa0e5ce: Added `extractProperties()` function for extracting specified properties and their values from an obejct.
- aa0e5ce: Added `parseData()` function for parsing design token data
- aa0e5ce: Added `isPlainObject()` function for checking if a value is a plain object.
