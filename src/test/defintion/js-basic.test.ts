import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import { waitForLoadingExtension } from "../utils.test";

suite("js basic", () => {
  suite("vue file", () => {
    let workspaceRoot: string = "";
    let extension: vscode.Extension<any>;

    async function getDocument(): Promise<vscode.TextDocument> {
      const targetFileUri = vscode.Uri.file(
        path.join(workspaceRoot, "src/App.vue")
      );

      return vscode.workspace.openTextDocument(targetFileUri);
    }

    suiteSetup(async () => {
      workspaceRoot = path.resolve(
        __dirname,
        "../../../fixtures/definition/js/basic"
      );
      extension = vscode.extensions.getExtension(
        "qjsrodksro.vuex-reference-helper"
      ) as vscode.Extension<any>;
    });

    test("Clicking 'getCount' of store.getters.getCount leads to a getter of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
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

    test("Clicking 'increment' of store.commit(\"increment\") leads to a mutation of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
      const expectedLine = 47;
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

    test("Clicking 'incrementBy' of store.commit(\"incrementBy\") leads to a mutation of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
      const expectedLine = 50;
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

    test("Clicking 'increment' of store.dispatch(\"increment\") leads to an action of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
      const expectedLine = 29;
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

    test("Clicking 'incrementBy' of store.dispatch(\"incrementBy\") leads to an action of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
      const expectedLine = 37;
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

    test("Clicking 'appDetail' of store.state.appDetail leads to a state of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
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

    test("Clicking 'setScrollPosition' of store.commit(\"setScrollPosition\") leads to a mutation of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
      const expectedLine = 53;
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

    test("Clicking 'getAppDetail' of store.getters.getAppDetail.scrollPosition leads to a getter of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
      const expectedLine = 23;
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
      await waitForLoadingExtension(extension);

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

    test("Clicking 'abc' of store.state.abc leads to a state of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
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

    test("Clicking 'abc' of store.getters.abc leads to a getter of index.js", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/index.js");
      const expectedLine = 26;
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
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/popup.js");
      const expectedLine = 0;
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

    test("Clicking 'isOpen' of store.state.popup.isOpen leads to a state of popup.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = "store.state.popup.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.popup.isOpen exists");

      const position = document.positionAt(startIndex + "store.state.popup.".length); // position of "isOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/popup.js");
      const expectedLine = 3;
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

    test("Clicking 'getIsOpen' of store.getters[\"getIsOpen\"] leads to a getter of popup.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = "store.getters[\"getIsOpen\"]";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.getters[\"getIsOpen\"] exists");

      const position = document.positionAt(startIndex + "store.getters[\"".length); // position of "getIsOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/popup.js");
      const expectedLine = 6;
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

    test("Clicking 'open' of store.commit(\"open\") leads to a mutation of popup.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.commit("open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("open") exists');

      const position = document.positionAt(startIndex + 'store.commit("'.length); // position of "open"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/popup.js");
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

    test("Clicking 'close' of store.commit(\"close\") leads to a mutation of popup.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.commit("close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("close") exists');

      const position = document.positionAt(startIndex + 'store.commit("'.length); // position of "close"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/popup.js");
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

    test("Clicking 'myBanner' of store.state.myBanner.modal.isOpen leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension(extension);

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
      const expectedFile = path.join(workspaceRoot, "src/store/banner.js");
      const expectedLine = 4;
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
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = "store.state.myBanner.modal.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.myBanner.modal.isOpen exists");

      const position = document.positionAt(startIndex + "store.state.myBanner.".length); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 2;
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

    test("Clicking 'isOpen' of store.state.myBanner.modal.isOpen leads to a state of modal.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = "store.state.myBanner.modal.isOpen";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.state.myBanner.modal.isOpen exists");

      const position = document.positionAt(startIndex + "store.state.myBanner.modal.".length); // position of "isOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 5;
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
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = "store.getters[\"myBanner/modal/getIsOpen\"]";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.getters[\"myBanner/modal/getIsOpen\"] exists");

      const position = document.positionAt(startIndex + "store.getters[\"".length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.js");
      const expectedLine = 4;
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
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = "store.getters[\"myBanner/modal/getIsOpen\"]";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.getters[\"myBanner/modal/getIsOpen\"] exists");

      const position = document.positionAt(startIndex + "store.getters[\"myBanner/".length); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 2;
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

    test("Clicking 'getIsOpen' of store.getters[\"myBanner/modal/getIsOpen\"] leads to a getter of modal.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = "store.getters[\"myBanner/modal/getIsOpen\"]";
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, "store.getters[\"myBanner/modal/getIsOpen\"] exists");

      const position = document.positionAt(startIndex + "store.getters[\"myBanner/modal/".length); // position of "getIsOpen"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 8;
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
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/open") exists');

      const position = document.positionAt(startIndex + 'store.commit("'.length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.js");
      const expectedLine = 4;
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
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/open") exists');

      const position = document.positionAt(startIndex + 'store.commit("myBanner/'.length); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 2;
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

    test("Clicking 'open' of store.commit(\"myBanner/modal/open\") leads to a mutation of modal.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/open") exists');

      const position = document.positionAt(startIndex + 'store.commit("myBanner/modal/'.length); // position of "open"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
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

    test("Clicking 'myBanner' of store.commit(\"myBanner/modal/close\") leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/close") exists');

      const position = document.positionAt(startIndex + 'store.commit("'.length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.js");
      const expectedLine = 4;
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
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/close") exists');

      const position = document.positionAt(startIndex + 'store.commit("myBanner/'.length); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 2;
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

    test("Clicking 'close' of store.commit(\"myBanner/modal/close\") leads to a mutation of modal.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.commit("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.commit("myBanner/modal/close") exists');

      const position = document.positionAt(startIndex + 'store.commit("myBanner/modal/'.length); // position of "close"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
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

    test("Clicking 'myBanner' of store.dispatch(\"myBanner/modal/open\") leads to a banner module itself", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.dispatch("myBanner/modal/open") exists');

      const position = document.positionAt(startIndex + 'store.dispatch("'.length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.js");
      const expectedLine = 4;
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
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.dispatch("myBanner/modal/open") exists');

      const position = document.positionAt(startIndex + 'store.dispatch("myBanner/'.length); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 2;
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

    test("Clicking 'open' of store.dispatch(\"myBanner/modal/open\") leads to an action of modal.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/open")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.dispatch("myBanner/modal/open") exists');

      const position = document.positionAt(startIndex + 'store.dispatch("myBanner/modal/'.length); // position of "open"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 11;
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
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.dispatch("myBanner/modal/close") exists');

      const position = document.positionAt(startIndex + 'store.dispatch("'.length); // position of "myBanner"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/banner.js");
      const expectedLine = 4;
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
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.dispatch("myBanner/modal/close") exists');

      const position = document.positionAt(startIndex + 'store.dispatch("myBanner/'.length); // position of "modal"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 2;
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

    test("Clicking 'close' of store.dispatch(\"myBanner/modal/close\") leads to an action of modal.js", async () => {
      // given
      await waitForLoadingExtension(extension);

      const document = await getDocument();
      const searchString = 'store.dispatch("myBanner/modal/close")';
      const startIndex = document.getText().indexOf(searchString);

      assert.ok(startIndex > -1, 'store.dispatch("myBanner/modal/close") exists');

      const position = document.positionAt(startIndex + 'store.dispatch("myBanner/modal/'.length); // position of "close"

      // when
      const definitions = await vscode.commands.executeCommand<
        vscode.Location[]
      >("vscode.executeDefinitionProvider", document.uri, position);

      // then
      assert.ok(definitions.length > 0, "Definitions exist");

      const definition = definitions[0];
      const expectedFile = path.join(workspaceRoot, "src/store/modules/modal.js");
      const expectedLine = 19;
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

  // suite("usage(js) file", () => {
  //   let workspaceRoot: string;

  //   suiteSetup(async () => {
  //     workspaceRoot = path.resolve(__dirname, "./fixtures/definition/js/basic");
  //   });

  //   // test("Clicking 'myBanner' of st.state.myBanner.isOpen leads to a banner module itself", async () => {});

  //   // test("Clicking 'isOpen' of st.state.myBanner.isOpen leads to a state of banner.js", async () => {});

  //   // test("Clicking 'myBanner' of st.getters[\"myBanner/getIsOpen\"] leads to a banner module itself", async () => {});

  //   // test("Clicking 'getIsOpen' of st.getters[\"myBanner/getIsOpen\"] leads to a getter of banner.js", async () => {});

  //   // test("Clicking 'myBanner' of st\n.commit(\n\"myBanner/open\"\n) leads to a banner module itself", async () => {});

  //   // test("Clicking 'open' of st\n.commit(\n\"myBanner/open\"\n) leads to a mutation of banner.js", async () => {});

  //   // test("Clicking 'myBanner' of st.commit(\"myBanner/close\") leads to a banner module itself", async () => {});

  //   // test("Clicking 'close' of st.commit(\"myBanner/close\") leads to a mutation of banner.js", async () => {});
  // });

  // suite("definition file", async () => {});
});
