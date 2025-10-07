import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import { waitForLoadingExtension } from "../utils.test";

suite("ts basic", () => {
  let workspaceRoot: string = "";

  suiteSetup(() => {
    workspaceRoot = path.resolve(
      __dirname,
      "../../../fixtures/definition/ts/basic"
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
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 32;
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

    test("Clicking 'increment' of store.commit(\"increment\") leads to a mutation of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("increment")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("increment") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("'.length
      ); // position of "increment"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 59;
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

    test("Clicking 'incrementBy' of store.commit(\"incrementBy\") leads to a mutation of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("incrementBy", 2)';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("incrementBy") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("'.length
      ); // position of "incrementBy"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 62;
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

    test("Clicking 'increment' of store.dispatch(\"increment\") leads to an action of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.dispatch("increment")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.dispatch("increment") exists');

      const position = document.positionAt(
        startIndex + 'store.dispatch("'.length
      ); // position of "increment"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 41;
      const expectedCharacter = 10;
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

    test("Clicking 'incrementBy' of store.dispatch(\"incrementBy\") leads to an action of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.dispatch("incrementBy", 2)';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.dispatch("incrementBy") exists');

      const position = document.positionAt(
        startIndex + 'store.dispatch("'.length
      ); // position of "incrementBy"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 49;
      const expectedCharacter = 10;
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

    test("Clicking 'appDetail' of store.state.appDetail leads to a state of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.state.appDetail";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.appDetail exists");

      const position = document.positionAt(startIndex + "store.state.".length); // position of "appDetail"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 21;
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

    test("Clicking second 'appDetail' of store.state.appDetail.appDetail does not lead to anything", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.state.appDetail.appDetail";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.appDetail.appDetail exists");

      const position = document.positionAt(
        startIndex + "store.state.appDetail.".length
      ); // position of second "appDetail"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length === 0, "Definitions do not exist");
    });

    test("Clicking 'setScrollPosition' of store.commit(\"setScrollPosition\") leads to a mutation of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = '"setScrollPosition"';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("setScrollPosition") exists');

      const position = document.positionAt(startIndex + '"'.length); // position of "setScrollPosition"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 65;
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

    test("Clicking 'getAppDetail' of store.getters.getAppDetail.scrollPosition leads to a getter of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.getters.getAppDetail.scrollPosition";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        "store.getters.getAppDetail.scrollPosition exists"
      );

      const position = document.positionAt(
        startIndex + "store.getters.".length
      ); // position of "getAppDetail"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 35;
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

    test("Clicking 'scrollPosition' of store.getters.getAppDetail.scrollPosition does not lead to anything", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.getters.getAppDetail.scrollPosition";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        "store.getters.getAppDetail.scrollPosition exists"
      );

      const position = document.positionAt(
        startIndex + "store.getters.getAppDetail.".length
      ); // position of "scrollPosition"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length === 0, "Definitions do not exist");
    });

    test("Clicking 'abc' of store.state.abc leads to a state of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.state.abc";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.abc exists");

      const position = document.positionAt(startIndex + "store.state.".length); // position of "abc"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 29;
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

    test("Clicking 'abc' of store.getters.abc leads to a getter of index.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.getters.abc";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.getters.abc exists");

      const position = document.positionAt(
        startIndex + "store.getters.".length
      ); // position of "abc"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
      const expectedLine = 38;
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

    test("Clicking 'popup' of store.state.popup.isOpen leads to a popup module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.state.popup.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.popup.isOpen exists");

      const position = document.positionAt(startIndex + "store.state.".length); // position of "popup"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/popup.ts");
      const expectedLine = 4;
      const expectedCharacter = 15;
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

    test("Clicking 'isOpen' of store.state.popup.isOpen leads to a state of popup.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.state.popup.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.popup.isOpen exists");

      const position = document.positionAt(
        startIndex + "store.state.popup.".length
      ); // position of "isOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/popup.ts");
      const expectedLine = 7;
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

    test("Clicking 'getIsOpen' of store.getters[\"getIsOpen\"] leads to a getter of popup.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.getters["getIsOpen"]';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.getters["getIsOpen"] exists');

      const position = document.positionAt(
        startIndex + 'store.getters["'.length
      ); // position of "getIsOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/popup.ts");
      const expectedLine = 10;
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

    test("Clicking 'open' of store.commit(\"open\") leads to a mutation of popup.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("open") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("'.length
      ); // position of "open"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/popup.ts");
      const expectedLine = 13;
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

    test("Clicking 'close' of store.commit(\"close\") leads to a mutation of popup.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("close") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("'.length
      ); // position of "close"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/popup.ts");
      const expectedLine = 16;
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

    test("Clicking 'myBanner' of store.state.myBanner.modal.isOpen leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.state.myBanner.modal.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.myBanner.modal.isOpen exists");

      const position = document.positionAt(startIndex + "store.state.".length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'modal' of store.state.myBanner.modal.isOpen leads to a modal module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.state.myBanner.modal.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.myBanner.modal.isOpen exists");

      const position = document.positionAt(
        startIndex + "store.state.myBanner.".length
      ); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 6;
      const expectedCharacter = 25;
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

    test("Clicking 'isOpen' of store.state.myBanner.modal.isOpen leads to a state of modal.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "store.state.myBanner.modal.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.myBanner.modal.isOpen exists");

      const position = document.positionAt(
        startIndex + "store.state.myBanner.modal.".length
      ); // position of "isOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 9;
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

    test("Clicking 'myBanner' of store.getters[\"myBanner/modal/getIsOpen\"] leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.getters["myBanner/modal/getIsOpen"]';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        'store.getters["myBanner/modal/getIsOpen"] exists'
      );

      const position = document.positionAt(
        startIndex + 'store.getters["'.length
      ); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'modal' of store.getters[\"myBanner/modal/getIsOpen\"] leads to a modal module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.getters["myBanner/modal/getIsOpen"]';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        'store.getters["myBanner/modal/getIsOpen"] exists'
      );

      const position = document.positionAt(
        startIndex + 'store.getters["myBanner/'.length
      ); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 6;
      const expectedCharacter = 25;
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

    test("Clicking 'getIsOpen' of store.getters[\"myBanner/modal/getIsOpen\"] leads to a getter of modal.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.getters["myBanner/modal/getIsOpen"]';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        'store.getters["myBanner/modal/getIsOpen"] exists'
      );

      const position = document.positionAt(
        startIndex + 'store.getters["myBanner/modal/'.length
      ); // position of "getIsOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 12;
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

    test("Clicking 'myBanner' of store.commit(\"myBanner/modal/open\") leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/open") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("'.length
      ); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'modal' of store.commit(\"myBanner/modal/open\") leads to a modal module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/open") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("myBanner/'.length
      ); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 6;
      const expectedCharacter = 25;
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

    test("Clicking 'open' of store.commit(\"myBanner/modal/open\") leads to a mutation of modal.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/open") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("myBanner/modal/'.length
      ); // position of "open"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 33;
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

    test("Clicking 'myBanner' of store.commit(\"myBanner/modal/close\") leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/close") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("'.length
      ); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'modal' of store.commit(\"myBanner/modal/close\") leads to a modal module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/close") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("myBanner/'.length
      ); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 6;
      const expectedCharacter = 25;
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

    test("Clicking 'close' of store.commit(\"myBanner/modal/close\") leads to a mutation of modal.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/close") exists');

      const position = document.positionAt(
        startIndex + 'store.commit("myBanner/modal/'.length
      ); // position of "close"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 36;
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

    test("Clicking 'myBanner' of store.dispatch(\"myBanner/modal/open\") leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        'store.dispatch("myBanner/modal/open") exists'
      );

      const position = document.positionAt(
        startIndex + 'store.dispatch("'.length
      ); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'modal' of store.dispatch(\"myBanner/modal/open\") leads to a modal module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        'store.dispatch("myBanner/modal/open") exists'
      );

      const position = document.positionAt(
        startIndex + 'store.dispatch("myBanner/'.length
      ); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 6;
      const expectedCharacter = 25;
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

    test("Clicking 'open' of store.dispatch(\"myBanner/modal/open\") leads to an action of modal.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        'store.dispatch("myBanner/modal/open") exists'
      );

      const position = document.positionAt(
        startIndex + 'store.dispatch("myBanner/modal/'.length
      ); // position of "open"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 15;
      const expectedCharacter = 10;
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

    test("Clicking 'myBanner' of store.dispatch(\"myBanner/modal/close\") leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        'store.dispatch("myBanner/modal/close") exists'
      );

      const position = document.positionAt(
        startIndex + 'store.dispatch("'.length
      ); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'modal' of store.dispatch(\"myBanner/modal/close\") leads to a modal module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        'store.dispatch("myBanner/modal/close") exists'
      );

      const position = document.positionAt(
        startIndex + 'store.dispatch("myBanner/'.length
      ); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 6;
      const expectedCharacter = 25;
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

    test("Clicking 'close' of store.dispatch(\"myBanner/modal/close\") leads to an action of modal.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(
        startIndex > -1,
        'store.dispatch("myBanner/modal/close") exists'
      );

      const position = document.positionAt(
        startIndex + 'store.dispatch("myBanner/modal/'.length
      ); // position of "close"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(
        workspaceRoot,
        "src/store/modules/modal.ts"
      );
      const expectedLine = 23;
      const expectedCharacter = 10;
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

  suite("useBanner.ts", () => {
    async function getDocument(): Promise<vscode.TextDocument> {
      const targetFileUri = vscode.Uri.file(
        path.join(workspaceRoot, "src/compositions/useBanner.ts")
      );

      return vscode.workspace.openTextDocument(targetFileUri);
    }

    test("Clicking 'myBanner' of st.state.myBanner.isOpen leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "st.state.myBanner.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "st.state.myBanner.isOpen exists");

      const position = document.positionAt(startIndex + "st.state.".length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'isOpen' of st.state.myBanner.isOpen leads to a state of banner.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "st.state.myBanner.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "st.state.myBanner.isOpen exists");

      const position = document.positionAt(
        startIndex + "st.state.myBanner.".length
      ); // position of "isOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 11;
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

    test("Clicking 'myBanner' of st.getters[\"myBanner/getIsOpen\"] leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'st.getters["myBanner/getIsOpen"]';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'st.getters["myBanner/getIsOpen"] exists');

      const position = document.positionAt(startIndex + 'st.getters["'.length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'getIsOpen' of st.getters[\"myBanner/getIsOpen\"] leads to a getter of banner.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'st.getters["myBanner/getIsOpen"]';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'st.getters["myBanner/getIsOpen"] exists');

      const position = document.positionAt(
        startIndex + 'st.getters["myBanner/'.length
      ); // position of "getIsOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 14;
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

    test("Clicking 'myBanner' of st!.state?.myBanner!.isOpen leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "st!.state?.myBanner!.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "st!.state?.myBanner!.isOpen exists");

      const position = document.positionAt(startIndex + "st!.state?.".length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'isOpen' of st!.state?.myBanner!.isOpen leads to a state of banner.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "st!.state?.myBanner!.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "st!.state?.myBanner!.isOpen exists");

      const position = document.positionAt(
        startIndex + "st!.state?.myBanner!.".length
      ); // position of "isOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 11;
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

    test("Clicking 'myBanner' of st\n.commit(\n\"myBanner/open\"\n) leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = '"myBanner/open"';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'st\n.commit(\n"myBanner/open"\n) exists');

      const position = document.positionAt(startIndex + '"'.length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'open' of st\n.commit(\n\"myBanner/open\"\n) leads to a mutation of banner.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = '"myBanner/open"';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, '"myBanner/open" exists');

      const position = document.positionAt(startIndex + '"myBanner/'.length); // position of "open"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 17;
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

    test("Clicking 'myBanner' of st.commit(\"myBanner/close\") leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'st.commit("myBanner/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'st.commit("myBanner/close") exists');

      const position = document.positionAt(startIndex + 'st.commit("'.length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 8;
      const expectedCharacter = 22;
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

    test("Clicking 'close' of st.commit(\"myBanner/close\") leads to a mutation of banner.ts", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = 'st.commit("myBanner/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'st.commit("myBanner/close") exists');

      const position = document.positionAt(
        startIndex + 'st.commit("myBanner/'.length
      ); // position of "close"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.ts");
      const expectedLine = 20;
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

  suite("index.ts", () => {
    async function getDocument(): Promise<vscode.TextDocument> {
      const targetFileUri = vscode.Uri.file(
        path.join(workspaceRoot, "src/store/index.ts")
      );

      return vscode.workspace.openTextDocument(targetFileUri);
    }

    suite(
      "Clicking 'incrementBy' of dispatch(\"incrementBy\", 1) leads to an action of itself",
      async () => {
        // given
        await waitForLoadingExtension();

        const document = await getDocument();
        const searchString = 'dispatch("incrementBy", 1)';
        const startIndex = document.getText().indexOf(searchString);

        assert.ok(startIndex > -1, 'dispatch("incrementBy", 1) exists');

        const position = document.positionAt(startIndex + 'dispatch("'.length); // position of "incrementBy"

        // when
        const definitions = await vscode.commands.executeCommand<
          vscode.Location[]
        >("vscode.executeDefinitionProvider", document.uri, position);

        // then
        assert.ok(definitions.length > 0, "Definitions exist");

        const definition = definitions[0];
        const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
        const expectedLine = 49;
        const expectedCharacter = 10;
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
      }
    );

    suite(
      "Clicking 'incrementBy' of context.commit(\"incrementBy\", payload) leads to a mutation of itself",
      async () => {
        // given
        await waitForLoadingExtension();

        const document = await getDocument();
        const searchString = 'context.commit("incrementBy", payload)';
        const startIndex = document.getText().indexOf(searchString);

        assert.ok(
          startIndex > -1,
          'context.commit("incrementBy", payload) exists'
        );

        const position = document.positionAt(
          startIndex + 'context.commit("'.length
        ); // position of "incrementBy"

        // when
        const definitions = await vscode.commands.executeCommand<
          vscode.Location[]
        >("vscode.executeDefinitionProvider", document.uri, position);

        // then
        assert.ok(definitions.length > 0, "Definitions exist");

        const definition = definitions[0];
        const expectedFile = path.join(workspaceRoot, "src/store/index.ts");
        const expectedLine = 62;
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
      }
    );
  });

  suite("modal.ts", () => {
    async function getDocument(): Promise<vscode.TextDocument> {
      const targetFileUri = vscode.Uri.file(
        path.join(workspaceRoot, "src/store/modules/modal.ts")
      );

      return vscode.workspace.openTextDocument(targetFileUri);
    }

    suite(
      "Clicking 'open' of commit(\"open\") leads to a mutation of itself",
      async () => {
        // given
        await waitForLoadingExtension();

        const document = await getDocument();
        const searchString = 'commit("open")';
        const startIndex = document.getText().indexOf(searchString);

        assert.ok(startIndex > -1, 'commit("open") exists');

        const position = document.positionAt(startIndex + 'commit("'.length); // position of "open"

        // when
        const definitions = await vscode.commands.executeCommand<
          vscode.Location[]
        >("vscode.executeDefinitionProvider", document.uri, position);

        // then
        assert.ok(definitions.length > 0, "Definitions exist");

        const definition = definitions[0];
        const expectedFile = path.join(
          workspaceRoot,
          "src/store/modules/modal.ts"
        );
        const expectedLine = 33;
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
      }
    );

    suite(
      "Clicking 'close' of context.commit(\"close\") leads to a mutation of itself",
      async () => {
        // given
        await waitForLoadingExtension();

        const document = await getDocument();
        const searchString = 'context.commit("close")';
        const startIndex = document.getText().indexOf(searchString);

        assert.ok(startIndex > -1, 'context.commit("close") exists');

        const position = document.positionAt(
          startIndex + 'context.commit("'.length
        ); // position of "close"

        // when
        const definitions = await vscode.commands.executeCommand<
          vscode.Location[]
        >("vscode.executeDefinitionProvider", document.uri, position);

        // then
        assert.ok(definitions.length > 0, "Definitions exist");

        const definition = definitions[0];
        const expectedFile = path.join(
          workspaceRoot,
          "src/store/modules/modal.ts"
        );
        const expectedLine = 36;
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
      }
    );
  });
});
