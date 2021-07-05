import * as assert from "assert";
import { Uri } from "vscode";
import { LinterOffense, LinterOffenseSeverity } from "vscode-linter-api";
import * as linter from "../../extension";

const stdout = `stdin:2:10-10: (W211) unused variable 'x'
stdin:1:11-19: (W631) line is too long (19 > 10)`;

function assertOffense(actual: LinterOffense, expected: LinterOffense) {
  assert.strictEqual(actual.code, expected.code);
  assert.strictEqual(actual.columnEnd, expected.columnEnd);
  assert.strictEqual(actual.columnStart, expected.columnStart);
  assert.strictEqual(actual.correctable, expected.correctable);
  assert.strictEqual(actual.lineEnd, expected.lineEnd);
  assert.strictEqual(actual.lineStart, expected.lineStart);
  assert.strictEqual(actual.message, expected.message);
  assert.strictEqual(actual.source, expected.source);
  assert.strictEqual(actual.severity, expected.severity);
  assert.strictEqual(actual.uri, expected.uri);
  assert.strictEqual(actual.url, expected.url);
}

suite("Extension Test Suite", () => {
  test("returns offenses", () => {
    const uri = Uri.parse("/file.lua");

    const offenses = linter.getOffenses({
      stdout,
      stderr: "",
      uri,
      status: 0,
    });

    assert.strictEqual(offenses.length, 2);

    assertOffense(offenses[0], {
      uri,
      code: "W211",
      lineStart: 1,
      lineEnd: 1,
      columnStart: 9,
      columnEnd: 9,
      correctable: false,
      message: "unused variable 'x'",
      source: "luacheck",
      severity: LinterOffenseSeverity.error,
    });

    assertOffense(offenses[1], {
      uri,
      code: "W631",
      lineStart: 0,
      lineEnd: 0,
      columnStart: 10,
      columnEnd: 18,
      correctable: false,
      message: "line is too long (19 > 10)",
      source: "luacheck",
      severity: LinterOffenseSeverity.error,
    });
  });
});
