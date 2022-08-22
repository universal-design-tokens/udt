# UDT demos

A collection of small demo scripts to show how the core UDT libraries can be used.

<!-- TOC updateonsave:true depthfrom:2 -->

- [DTCG to SCSS](#dtcg-to-scss)
    - [Usage](#usage)
- [Log DTCG info](#log-dtcg-info)
    - [Usage](#usage)
- [Migrate DTCG Editor's Draft 1 to DTCG](#migrate-dtcg-editors-draft-1-to-dtcg)
    - [Usage](#usage)
- [Serialize TOM to DTCG](#serialize-tom-to-dtcg)
    - [Usage](#usage)

<!-- /TOC -->

## DTCG to SCSS
Illustrates how a design token translation tool could be build using the UDT libraries.

It uses `@udt/dtcg-parser` to parse a DTCG file to a TOM, and then traverses all the design tokens in that TOM and outputs them as SCSS variables. The variable names are produced by concatenating and kebab-casing the path to the token. For example:

```scss
// Token description
$path-to-the-token: token-value-as-css;
```

By default, the values will be dereferenced. However, via command-line option, you can disable that and have the references output like so:

```scss
// Token description
$path-to-the-token: $path-to-referenced-token;
```

### Usage

```sh
node ./dist/dtcg-to-scss.js [-p] [path-to-DTCG-file]
```

Reads the given DTCG file and outputs the tokens within as SCSS variables.

If no filename is given, an example file will be used instead. The optional `-p` option will preserve references in the output.


## Log DTCG info
Illstrates how an analysis tool that displays info about the contents of a DTCG file could be built using the UDT libraries.

This demo reads a DTCG file using the `@udt/dtcg-parser` library and then traverses the resulting TOM and logs information about all the groups and tokens to the console.

### Usage

```sh
node ./dist/log-dtcg-info.js [path-to-DTCG-file]
```

Reads the given DTCG file and logs information about its contents to the console.

If no filename is given, an example file will be used instead.


## Migrate DTCG Editor's Draft 1 to DTCG
Illustrates how a migration tool that converts a different format into a valid DTCG file could be built using the UDT libraries.

In this case, the demo contains code that can parse a 1st Editors' Draft of the DTCG spec (which is incompatible with later drafts of the spec) to a TOM, using the `@udt/tom` library. The resulting TOM is then written out to a DTCG file using the `@udt/dtcg-serializer` library.

### Usage

```sh
node ./dist/migrate-draft-1-to-dtcg.js [path-to-DTCG-file]
```

Reads the given DTCG Draft 1 file, and outputs its contents in the corresponding (current) DTCG format.

If no filename is given, an example file will be used instead.


## Serialize TOM to DTCG
Illustrates how a TOM can be programmatically generated and then serialized to a valid DTCG file using the UDT libraries.

A TOM is constructed using the `@udt/tom` API and then output as a DTCG file using the `@udt/dtcg-serialize` library.


### Usage

```sh
node ./dist/serialize-tom-to-dtcg.js
```

Prgrammatically generates design token data and then outputs it in the DTCG format.
