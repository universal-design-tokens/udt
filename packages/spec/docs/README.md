# Universal Design Tokens (UDT) Specification
**Status:** Draft. Please do not rely on this for production yet. Feedback is most welcome!

## Background
With the rise of design systems several tools that export, convert or import [design token](./background/design-tokens.md) data have been created. Unfortunately, each one uses its own, custom format for expressing that design token data. This limits interoperability between such tools and creates additional work for those wishing to integrate them into their design systems.

While most existing tools use simple, self-explanatory JSON or YAML-based formats, the structure of the data within those files is nonetheless custom. Furthermore, the documentation of those file formats is sometimes limited. This means that others wishing to connect different tools, generate data or process data need to reverse engineer those formats and write their own bespoke code to work with it.

The Universal Design Tokens (UDT) project aims to improve this situation by defining a single file format for design token data that anyone can then use. The hope is that this will provide benefits to:

* **Design system teams**, who can...
    * Migrate their design token data between tools easily.
    * Integrate a greater variety of tools with one another more easily.
* **Tool makers**, who can...
    * Spend more effort on _doing_ something useful or novel with design tokens, instead spending effort on the details of how to read / write the source data from / to files.
    * Reach a wider audience, since there will be a lower barrier of adoption for design system teams already using UDT files and compatible tools.

## Usage
This UDT specification is an open standard. It is, and always will be, available to all free of charge. Anyone is allowed to implement software (both open-source and closed-source) that implements this specification without needing to ask permission or paying anything. Furthermore, the UDT project places no restrictions on the authoring or distribution of UDT files.

## Aims
The UDT specification strives to achieve the following aims:

* Programming language agnostic: In order to allow the broadest possible adoption in tools, it should be possible to write UDT parsers/serialisers in any programming language.
* Testable conformance: In order to ensure full interoperability between tools, it should be possible to check (e.g. via validation) that a given file correctly adheres to the UDT specification.
* Strongly typed: In order to allow tools to be able to perform appropriate operations, transforms, etc. on a given design token, they need to know the type of that token (e.g. color, length, time, etc.). All design tokens in UDT should therefore be strongly typed.


## File structure
UDT files are [JSON](https://www.json.org/) files that follow certain rules. A [JSON schema](http://json-schema.org/) is maintained alongside this specification document, so that UDT files can be validated. Note however, that just validating a UDT files against the JSON schema does not guarantee full conformance, as this only checks the _syntax_ of the file.

* Current [UDT JSON schema](../schemas/dev/udt-schema.json)

At the top level, a UDT must be an object with the following two properties:

* `$schema`: The URI of the UDT version this file conforms to.
* `tokens`: Either a single design token, a set of design tokens or an array of design tokens.

```json
{
  "$schema": "http://udt.design/schemas/dev/udt-schema.json",
  "tokens": []
}
```

## Design tokens
Individual design tokens are represented as objects, with the following properties:

* `name`: The name of this design token. Must be a string value.
* `value`: The value of this design token. Permitted types and/or values depend on the `type` of this design token (see below). Values may also reference other tokens, in which case the referenced token's value is used.

```json
{
  "name": "...",
  "value": "..."
}
```

### Optional properties
Additionally, design token objects may have the following _optional_ properties:

* `type`: Sets the type of this token. Permitted values are: `json` and `color`.
    * If not set, the token will inherit its type from the nearest parent (file, set or array) that has a `type` set. If no type is inherited, then `json` is used as a fallback type.
* `id`: A unique (within the enclosing UDT file) identifier for this token. Must be a string value.
    * Only tokens with `id`s can be referenced from elsewhere.
* `description`: Text describing this token's purpose. Must be a string value or token reference.
    * Tools that export design tokens as variables in source code may use this text for accompanying in-source comments. Similarly, tools that visualise the design tokens in a styleguide, may show this text alongside the token's visualisation.
    * Descriptions may also reference other tokens, in which case the referenced token's description is used.

### Token types
#### Color
Color tokens represent a single color value.

Color tokens must adhere to the following:

* `type` must be set to or inherit: `color`.
* `value` must be a string containing an RGB hexadecimal triplet (case insensitive), or a reference to another color token.


#### JSON
JSON tokens may contain arbitrary JSON values (string, number, boolean, null, array or object). Their main purpose is to be a fallback for when no other type is specified for a token. Tools should not assume or ascribe any specific visual purpose to tokens of this type.

JSON tokens may have their `type` set to or inherit the value `json`. However, if not type is set or inherited, then the value `json` is assumed.


### Referencing
Some token properties may reference the corresponding property value of another token, as long as that token has an `id`. To do so, the property should have a token reference instead of a value. Token references are string in the form: `@id-of-other-token`.

For example:
```json
{
  "$schema": "http://udt.design/schemas/dev/udt-schema.json",
  "tokens": [
    {
      "name": "Token A",
      "type": "color",
      "value": "@token-b"
    },
    {
      "name": "Token B",
      "id": "token-b",
      "type": "color",
      "value": "#123456"
    }
  ]
}
```

In this UDT file there are two design tokens: "Token A" and "Token B". "Token B" has an `id` (`token-b`), which makes it referencable. "Token A" makes use of this by referencing "Token B" for its value. This has the effect that the `value` of "Token A" is the same as the `value` of "Token B".


## Token sets
Design tokens within a UDT file may be orgainsed into unordered sets. Sets can also contain other sets, so tokens can be organised into a tree-like structure of arbitrary depth.

Token sets are objects, with arbitrarily named properties (except for some reserved ones - see below) whose values may be either design tokens, token sets or token arrays.
