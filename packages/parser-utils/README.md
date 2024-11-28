# Design Token Parser Utilities

Low-level logic and utilities to help build parsers for DTCG and DTCG-like files. Will be used by [`@udt/dtcg-parser`](../dtcg-parser/) to parse DTCG to a Token Object Model (TOM), but also suitable for building libraries or tools that parse DTCG(-like) files to other representations, or need to traverse tokens and/or groups.

## Usage

```js
import { parseData } from "@udt/parser-utils";

// Given a nested object structure representing groups
// and design tokens (e.g. the result of reading a DTCG file
// and running it through JSON.parse())...
const fileData = { /* ... */ };

// ...parseData() will traverse through it and pass the
// relevant properties of each group and design token
// object it encounters to the functions you provide in
// the config:
const parsedData = parseData(fileData, {
  /* Parser config */

  // A function that checks whether an object is
  // a design token or not (if not, it is assumed
  // to be a group).
  //
  // E.g. for DTCG data, this could check for the
  // presence of a $value property.
  isDesignTokenData: (data) => {
    /* ... */
    return /* true for tokens, false otherwise */;
  },

  // Array of strings and/or RegExp which match
  // properties of group objects that are NOT
  // names of child design tokens or groups.
  //
  // E.g. for DTCG data, this could be a RegEx
  // like /^$/ which would match all $-prefixed
  // format properties
  groupPropsToExtract: [ /* ... */ ];

  // Function which is called for each design token
  // data object that is encountered.
  //
  // Is given the design token data and its path, and
  // should parse that data into whatever structure is
  // desired.
  parseDesignTokenData: (data, path, contextFromParent) => {
    /* ... */
    return parsedDesignToken;
  },

  // OPTIONAL function which is called for each group data object
  // that is encountered.
  //
  // Is given the extracted properties of that group and its
  // path, and should parse that data into whatever structure
  // is desired.
  parseGroupData: (data, path, contextFromParent) => {
    /* ... */
    return {
      group: parsedGroup,

      // OPTIONAL:
      contextForChildren: /* anything you like */,
    }
  },

  // OPTIONAL function which is called for each design token and/or
  // nested group found within a group.
  //
  // Useful if your parsed groups and design tokens need to be assembled into
  // a tree structure.
  addChildToGroup: (parsedParentGroup, childName, parsedChildGroupOrToken) => { /*... */ },
});
```

Note, this package contains TypeScript typings, which are annotated with doc blocks. Please refer to those for more
detail about the parameters and return values of the config
functions. Many popular IDEs (e.g. VSCode) will surface that
info via auto-completions and tooltips as you code, even if
you're writing plain JavaScript.
