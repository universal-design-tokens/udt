# UDT format (DRAFT)

## Basics
UDT is essentially a JSON Schema. Therefore every UDT file is a JSON file, but they follow a well-defined structure.

UDT files are structured as follows:
```js
{
  "meta": {
    // MANDATORY
    // Meta-data about this file

    "udtVersion": "0.1.0" // The spec version this file conforms to
  },

  // All other sections are optional:

  "imports": {
    // Other UDT files to import
  }

  // Primitive token types

  "colors": [
    // Color tokens
  ],

  "lenghts": [
    // Length tokens
  ],

  "numbers": [
    // Number tokens
  ],


  // Composite token types

  "colorPairs": [
    // Color pair tokens
  ]
}
```

Besides `meta` and `imports`, all other top-level properties correspond to the supported token types and each are an array of tokens of that respective type. This eliminates the need for each token to declare its type individually. Instead, a token's type is always determined by which top-level property it is placed under.


## Shared token properties
Every token, regardless of type, is a JSON objectmay have the following properties:

### Mandatory property
* `id`: An identifier for the token. Used for referencing it from elsewhere. Cannot begin with the `@` character and must not contain whitespace characters. Must be unique within a single UDT file. When tokens are exported into other languages that require some kind of identifier name (e.g. variables SASS, constants in JavaScript, etc.), the `id` can be used as a basis - possibly in conjunction with other information such as the UDT file's name or the token's category.

### Optional properties
* `name`: A human-friendly name for the token. May be used as a display name for the token, if listed in a style guide. Tools wishing to use this name, should use the `id` as a fallback for tokens that don't have a `name` property.
* `description`: A longer description text for this token. For instance, to explain its purpose or intended usage. Descriptions may also be `@`-references to other tokens, in which case they resolve to the reference token's description.
* `category`: A category name or path for grouping tokens. All tokens sharing the same `category` value, are treated as members of that category. You can create nested sub-categories by using a `/` separator. For example, `"category": "colors"` assigns a token to a category called "colors". `"category": "colors/neutrals"` would assign it to a sub-category of "colors" called "neutrals".


## Primitive token types
### Color
Represents a single colour. 24-bit RGB for now - could support additional colour formats & colour spaces in future.

```js
{
  "id":     "black",    // Token's ID
  "color":  "#000000",  // Color value

  // Other optional token properties
  // (e.g. name, description, etc.)
}
```


### Length
Represents a single, one-dimensional length in one of the following units: px (equiv. to CSS pixels), rem (multiples of a platform's base font size). Maybe more units in future.

Is unoppionated about what that length is ultimately used for. Can be space (margins and paddings), border or stroke thicknesses, font-sizes, width or height measurements, etc.

```js
{
  "id":     "margin-default", // Token's ID
  "value":  "20px",           // Length value

  // Other optional token properties
  // (e.g. name, description, etc.)
}
```


### Number
A numeric value. Can be expressed as an integer (1), fraction (0.1) or percentage (10%).

Is unoppionated about what this fraction represents or is used for. Can be a multiplier for calculating a typographic or spacing scale, can be an alpha value for transparency, etc.

```js
{
  "id":     "life-universe-everything", // Token's ID
  "value":  "42",                       // Number value

  // Other optional token properties
  // (e.g. name, description, etc.)
}
```


## Composite token types
### Color pair
A tuple of 2 colours that are intended to be used together - typically as a foreground & background combination.

```js
{
  "id":  "inverted",  // Token's ID
  "fg":  "#ffffff",   // Foreground colour
  "bg":  "#000000",   // Background colour

  // Other optional token properties
  // (e.g. name, description, etc.)
}
```
