export const tabWidth = 2;

export function getIndent(indentAmount: number): string {
  return " ".repeat(tabWidth * indentAmount);
}

export type Indentable = (indentAmount?: number) => string;

export type Indenter = (...lines: (string | null | Indentable)[]) => Indentable;

export function indentLines(text: string, indentAmount = 0): string {
  return text
    .split("\n")
    .map((line) => getIndent(indentAmount).concat(line))
    .join("\n");
}

export const indentable: Indenter = (
  ...lines: (string | null | Indentable)[]
) => {
  return function (indentAmount = 0): string {
    return lines
      .filter((line) => line !== null)
      .map((line) =>
        typeof line === "function"
          ? line(indentAmount + 1)
          : indentLines(line as string, indentAmount)
      )
      .join("\n");
  };
};
