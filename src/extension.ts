import {
  LinterGetOffensesFunction,
  LinterOffense,
  LinterOffenseSeverity,
} from "vscode-linter-api";

const lineMatcher = /^stdin:(\d+):(\d+)-(\d+): \((.*?)\) (.+)$/;

export const getOffenses: LinterGetOffensesFunction = ({ stdout, uri }) => {
  return stdout
    .split(/\r?\n/)
    .map((line) => {
      const [_, lineNumber, colStartNumber, colEndNumber, code, message] =
        line.match(lineMatcher) ?? [];

      if (!message) {
        return;
      }

      const lineStart = Math.max(0, Number(lineNumber) - 1);
      const columnStart = Math.max(0, Number(colStartNumber) - 1);
      const columnEnd = Math.max(0, Number(colEndNumber) - 1);

      return {
        uri,
        code,
        message,
        lineStart,
        columnStart,
        lineEnd: lineStart,
        columnEnd: columnEnd,
        source: "luacheck",
        correctable: false,
        severity: LinterOffenseSeverity.error,
      } as LinterOffense;
    })
    .filter(Boolean) as LinterOffense[];
};
