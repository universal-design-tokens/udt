![UDT logo](http://udt.design/udt-logo.svg)

# Universal Design Tokens (UDT)
[![Build Status](https://travis-ci.org/universal-design-tokens/udt.svg?branch=master)](https://travis-ci.org/universal-design-tokens/udt)
[![Known Vulnerabilities](https://snyk.io/test/github/universal-design-tokens/udt/badge.svg)](https://snyk.io/test/github/universal-design-tokens/udt)
[![Greenkeeper badge](https://badges.greenkeeper.io/universal-design-tokens/udt.svg)](https://greenkeeper.io/)

Universal Design Tokens (UDT) is an open-standard file format for expressing design token data.

## Packages
This is a monorepo (using [Lerna](https://lernajs.io/)) containing the source code for several UDT packages:

* [**`@udt/spec`**](./packages/spec): The specification and JSON schemas for the Universal Design Token (UDT) format.
* [**`@udt/lib`**](./packages/lib): A Node.js library for parsing, manipulating and serialising design token data in the UDT format.
* [**`@udt/validator`**](./packages/validator): A Node.js library for validating UDT files against the spec's JSON schema.
* [**`@udt/validator-cli`**](./packages/validator-cli): A CLI for validating UDT files against the spec's JSON schema (using the `@udt/validator` library).
