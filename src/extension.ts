import * as vscode from "vscode";
import { buildSymbolTable } from "./table";
import { VuexDefinitionProvider } from "./VuexDefinitionProvider";
import { VuexCompletionItemProvider } from "./VuexCompletionItemProvider";
import { removeAst } from "./ast";

export async function activate(context: vscode.ExtensionContext) {
  let { vuexEntryUsageFiles, moduleFiles } = await buildSymbolTable();

  // allowed extensions: [js, ts, vue]
  const selector: vscode.DocumentSelector = [
    { language: "javascript", scheme: "file" },
    { language: "typescript", scheme: "file" },
    { language: "vue", scheme: "file" },
    { language: "plaintext", scheme: "file", pattern: "**/*.vue" }, // for test
  ];

  const defintionProvider = vscode.languages.registerDefinitionProvider(
    selector,
    new VuexDefinitionProvider()
  );
  context.subscriptions.push(defintionProvider);

  const completionItemProvider =
    vscode.languages.registerCompletionItemProvider(
      selector,
      new VuexCompletionItemProvider(),
      ".",
      "'",
      '"'
    );
  context.subscriptions.push(completionItemProvider);

  // all events are included: create / delete / rename / character change
  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(
    async (event) => {
      const isVuexEntryUsageFile = vuexEntryUsageFiles.some(
        (file) => file.fsPath === event.document.uri.fsPath
      );
      const isModuleFile = moduleFiles.some(
        (file) => file.fsPath === event.document.uri.fsPath
      );
      if (isVuexEntryUsageFile || isModuleFile) {
        const result = await buildSymbolTable(); // rebuild symbol table
        vuexEntryUsageFiles = result.vuexEntryUsageFiles;
        moduleFiles = result.moduleFiles;
      } else {
        removeAst(event.document.uri.fsPath); // remove from cache
      }
    }
  );
  context.subscriptions.push(onDidChangeTextDocument);
}

export function deactivate() {}
