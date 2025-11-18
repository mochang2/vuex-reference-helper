import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as sinon from "sinon";
import { waitForLoadingExtension, sleep } from "./utils.test";

suite("js basic", () => {
  let workspaceRoot: string = "";

  suiteSetup(() => {
    workspaceRoot = path.resolve(
      __dirname,
      "../../fixtures/ts/basic"
    );
  });

  test("Changing to vuex entry usage files triggers buildSymbolTable", async () => {
    // given
    const table = require("../table.js");
    const buildSymbolTableSpy = sinon.spy(table, "buildSymbolTable");

    // when
    await waitForLoadingExtension();

    // then
    assert.ok(
      buildSymbolTableSpy.callCount > 0,
      "buildSymbolTable should be called during extension activation"
    );

    // when
    // simulate text change event
    const targetFileUri = vscode.Uri.file(
      path.join(workspaceRoot, "src/main.ts")
    );
    const edit = new vscode.WorkspaceEdit();
    edit.insert(targetFileUri, new vscode.Position(0, 0), "// test comment\n");
    await vscode.workspace.applyEdit(edit);

    await sleep(2200); // wait for the debounce and the event to be processed

    // then
    assert.ok(
      buildSymbolTableSpy.callCount > 1,
      "buildSymbolTable should be called again after file change"
    );

    // restore
    buildSymbolTableSpy.restore();
  });
});
