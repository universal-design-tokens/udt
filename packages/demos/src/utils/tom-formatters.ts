import { DesignToken, Group, RootGroup, TOMNode } from "@udt/tom";
import chalk from "chalk";
import { indentable, Indentable } from "./text-formatting.js";
import { formatValue } from "./value-formatters.js";

function formatToken(node: DesignToken): Indentable {
  return indentable(
    chalk.blue(`* Token "${chalk.cyan.bold(node.getName())}"`),
    indentable(
      chalk.blue(`- resolved type: `) + chalk.magenta(node.getResolvedType()),
      chalk.blue(`- resolved value:`),
      indentable(formatValue(node.getValue(true), node.getResolvedType())),
      chalk.blue(`- is alias?: `) + chalk.magenta(node.isAlias()),
      node.hasExtensions()
        ? chalk.blue(`- has extensions: `) +
            [...node.extensions()]
              .map((keyExt) => keyExt[0])
              .map((ext) => chalk.magenta(ext))
              .join(chalk.magenta.dim(", "))
        : null
    )
  );
}

function formatGroup(node: Group): Indentable {
  const childNodes = [...node].map((node) => formatTomNode(node));

  return indentable(
    chalk.magenta(
      `* ${
        node instanceof RootGroup
          ? "File"
          : `Group "${chalk.magentaBright.bold(node.getName())}"`
      }`
    ),
    node.hasExtensions()
      ? chalk.blue(`- has extensions: `) +
          [...node.extensions()]
            .map((keyExt) => keyExt[0])
            .map((ext) => chalk.magenta(ext))
            .join(chalk.magenta.dim(", "))
      : null,
    ...childNodes
  );
}

export function formatTomNode(node: TOMNode): Indentable {
  if (node instanceof DesignToken) {
    return formatToken(node);
  } else if (node instanceof Group) {
    return formatGroup(node);
  } else {
    return indentable(
      chalk.redBright(`X Unknown node type "${node.getName()}"`)
    );
  }
}
