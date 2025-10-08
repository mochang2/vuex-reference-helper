import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import { waitForLoadingExtension } from "../utils.test";

suite("js basic", () => {
  let workspaceRoot: string = "";

  suiteSetup(() => {
    workspaceRoot = path.resolve(__dirname, "../../../fixtures/js/basic");
  });

  suite("App.vue", () => {
    async function getDocument(): Promise<vscode.TextDocument> {
      const targetFileUri = vscode.Uri.file(
        path.join(workspaceRoot, "src/App.vue")
      );

      return vscode.workspace.openTextDocument(targetFileUri);
    }

    test("Texting ${storeLocalName}.state. shows all states list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const store = useStore();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const store = useStore(); exists");

      const insertText = "store.state.";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "."
      );

      // then
      const expectedLabels = [
        "abc",
        "appDetail",
        "appDetail.scrollPosition",
        "appDetail.size",
        "appDetail.size.width",
        "appDetail.size.height",
        "count",
        "popup.isOpen",
        "myBanner.isOpen",
        "myBanner.modal.isOpen",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test("Texting ${storeLocalName}.getters. shows getters without namespace list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const store = useStore();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const store = useStore(); exists");

      const insertText = "store.getters.";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "."
      );

      // then
      const expectedLabels = ["getCount", "getAppDetail", "abc", "getIsOpen"];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test('Texting ${storeLocalName}.getters["] shows all getters list for completion', async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const store = useStore();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const store = useStore(); exists");

      const insertText = 'store.getters["';
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "'"
      );

      // then
      const expectedLabels = [
        "getCount",
        "getAppDetail",
        "abc",
        "getIsOpen",
        "myBanner/getIsOpen",
        "myBanner/modal/getIsOpen",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test("Texting ${storeLocalName}.getters['] shows all getters list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const store = useStore();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const store = useStore(); exists");

      const insertText = "store.getters['";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "'"
      );

      // then
      const expectedLabels = [
        "getCount",
        "getAppDetail",
        "abc",
        "getIsOpen",
        "myBanner/getIsOpen",
        "myBanner/modal/getIsOpen",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test('Texting ${storeLocalName}.commit(" shows all mutations list for completion', async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const store = useStore();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const store = useStore(); exists");

      const insertText = 'store.commit("';
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        '"'
      );

      // then
      const expectedLabels = [
        "increment",
        "incrementBy",
        "setScrollPosition",
        "myBanner/open",
        "myBanner/close",
        "myBanner/modal/open",
        "myBanner/modal/close",
        "open",
        "close",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test("Texting ${storeLocalName}.commit(' shows all mutations list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const store = useStore();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const store = useStore(); exists");

      const insertText = "store.commit('";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "'"
      );

      // then
      const expectedLabels = [
        "increment",
        "incrementBy",
        "setScrollPosition",
        "myBanner/open",
        "myBanner/close",
        "myBanner/modal/open",
        "myBanner/modal/close",
        "open",
        "close",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test('Texting ${storeLocalName}.dispatch(" shows all actions list for completion', async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const store = useStore();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const store = useStore(); exists");

      const insertText = 'store.dispatch("';
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "'"
      );

      // then
      const expectedLabels = [
        "increment",
        "incrementBy",
        "myBanner/modal/open",
        "myBanner/modal/close",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test("Texting ${storeLocalName}.dispatch(' shows all actions list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const store = useStore();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const store = useStore(); exists");

      const insertText = "store.dispatch('";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        '"'
      );

      // then
      const expectedLabels = [
        "increment",
        "incrementBy",
        "myBanner/modal/open",
        "myBanner/modal/close",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });
  });

  suite("useBanner.js", () => {
    async function getDocument(): Promise<vscode.TextDocument> {
      const targetFileUri = vscode.Uri.file(
        path.join(workspaceRoot, "src/compositions/useBanner.js")
      );

      return vscode.workspace.openTextDocument(targetFileUri);
    }

    test("Texting ${storeLocalName}.state. shows all states list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const st = us();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const st = us(); exists");

      const insertText = "st.state.";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "."
      );

      // then
      const expectedLabels = [
        "abc",
        "appDetail",
        "appDetail.scrollPosition",
        "appDetail.size",
        "appDetail.size.width",
        "appDetail.size.height",
        "count",
        "popup.isOpen",
        "myBanner.isOpen",
        "myBanner.modal.isOpen",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test("Texting ${storeLocalName}.getters. shows getters without namespace list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const st = us();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const st = us(); exists");

      const insertText = "st.getters.";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "."
      );

      // then
      const expectedLabels = ["getCount", "getAppDetail", "abc", "getIsOpen"];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test('Texting ${storeLocalName}.getters["] shows all getters list for completion', async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const st = us();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const st = us(); exists");

      const insertText = 'st.getters["';
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "'"
      );

      // then
      const expectedLabels = [
        "getCount",
        "getAppDetail",
        "abc",
        "getIsOpen",
        "myBanner/getIsOpen",
        "myBanner/modal/getIsOpen",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test("Texting ${storeLocalName}.getters['] shows all getters list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const st = us();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const st = us(); exists");

      const insertText = "st.getters['";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "'"
      );

      // then
      const expectedLabels = [
        "getCount",
        "getAppDetail",
        "abc",
        "getIsOpen",
        "myBanner/getIsOpen",
        "myBanner/modal/getIsOpen",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test('Texting ${storeLocalName}.commit(" shows all mutations list for completion', async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const st = us();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const st = us(); exists");

      const insertText = 'st.commit("';
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        '"'
      );

      // then
      const expectedLabels = [
        "increment",
        "incrementBy",
        "setScrollPosition",
        "myBanner/open",
        "myBanner/close",
        "myBanner/modal/open",
        "myBanner/modal/close",
        "open",
        "close",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test("Texting ${storeLocalName}.commit(' shows all mutations list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const st = us();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const st = us(); exists");

      const insertText = "st.commit('";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "'"
      );

      // then
      const expectedLabels = [
        "increment",
        "incrementBy",
        "setScrollPosition",
        "myBanner/open",
        "myBanner/close",
        "myBanner/modal/open",
        "myBanner/modal/close",
        "open",
        "close",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test('Texting ${storeLocalName}.dispatch(" shows all actions list for completion', async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const st = us();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const st = us(); exists");

      const insertText = 'st.dispatch("';
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        "'"
      );

      // then
      const expectedLabels = [
        "increment",
        "incrementBy",
        "myBanner/modal/open",
        "myBanner/modal/close",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });

    test("Texting ${storeLocalName}.dispatch(' shows all actions list for completion", async () => {
      // given
      await waitForLoadingExtension();

      const document = await getDocument();
      const searchString = "const st = us();";
      const endIndex =
        document.getText().indexOf(searchString) + searchString.length;

      assert.ok(endIndex > -1, "const st = us(); exists");

      const insertText = "st.dispatch('";
      const insertStartPosition = document.positionAt(endIndex);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, insertStartPosition, insertText);
      await vscode.workspace.applyEdit(edit);

      // when
      const insertEndPosition = document.positionAt(
        endIndex + insertText.length
      );
      const { items: completions } = await vscode.commands.executeCommand<
        vscode.CompletionList<vscode.CompletionItem>
      >(
        "vscode.executeCompletionItemProvider",
        document.uri,
        insertEndPosition,
        '"'
      );

      // then
      const expectedLabels = [
        "increment",
        "incrementBy",
        "myBanner/modal/open",
        "myBanner/modal/close",
      ];
      const labels = completions.map(({ label }) => label);
      expectedLabels.forEach((label) => {
        assert.ok(
          labels.includes(label),
          `${label} should be in the completions`
        );
      });
    });
  });
});
