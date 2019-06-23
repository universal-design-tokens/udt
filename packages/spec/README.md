![UDT logo](https://udt.design/udt-logo.svg)

# UDT Specification
The Universal Design Tokens (UDT) specification.

* Read the [current UDT specification](./docs/README.md)

## JSON schemas
The [JSON schemas](http://json-schema.org/) for the current, in-development version and any published versions of the UDT specification are in the `schemas/` directory:

* **Development schema**: [`schemas/dev/udt-schema.json`](./schemas/dev/udt-schema.json)
    * This is a "living" schema that reflects the latest state of spec development. It may change frequently and without warning, so it **must not** be used in production.
    * Once the current spec work stabilises, a versioned snapshot of this schema will be made. These snapshots will be added here and also published to the [UDT website](https://udt.design/). These are the schemas that should be used in production.

## NPM package
Since the JSON schemas can be of use to other tools, they are also published as the `@udt/spec` NPM package.
