---
"@udt/parser-utils": minor
---

BREAKING CHANGE: `parseData()` will now throw an `InvalidStructureError` if the top-level object in the input data is a design token.
