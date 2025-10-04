import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import { waitForLoadingExtension } from "../utils.test";

suite("ts extra", () => {
  let workspaceRoot: string = "";

  suiteSetup(() => {
    workspaceRoot = path.resolve(
      __dirname,
      "../../../fixtures/definition/ts/extra"
    );
  });

  suite("App.vue", () => {
    async function getDocument(): Promise<vscode.TextDocument> {
      const targetFileUri = vscode.Uri.file(
        path.join(workspaceRoot, "src/App.vue")
      );

      return vscode.workspace.openTextDocument(targetFileUri);
    }

    test("Clicking 'getCount' of store.getters.getCount leads to a getter of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.getters.getCount";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.getters.getCount exists");

      const position = document.positionAt(
        startIndex + "store.getters.".length
      ); // position of "getCount"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store2/index.ts");
      const expectedLine = 19;
      const expectedCharacter = 4;
      assert.strictEqual(
        definition.uri.fsPath,
        expectedFile,
        `Definition is declared at the ${expectedFile} file`
      );
      assert.strictEqual(
        definition.range.start.line,
        expectedLine,
        `Defintion is declared at the line ${expectedLine}th line`
      );
      assert.strictEqual(
        definition.range.end.character,
        expectedCharacter,
        `Defintion is declared at the line ${expectedCharacter}th character`
      );
    });
  });
});
