---
"@udt/parser-utils": minor
---

BREAKING CHANGE: `ParseGroupDataFn` can no longer return an `addChild` function. Instead, you should now provide an `addChildToGroup` function in your parser config.
