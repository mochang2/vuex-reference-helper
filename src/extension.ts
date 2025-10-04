import * as vscode from "vscode";
import { VuexDefinitionProvider } from "./VuexDefinitionProvider";
import { buildSymbolTable } from "./table";
import { removeAst } from "./ast";

// [TODO]
// 1. (2.1.0) vuexEntryFile에 변경이 생길 때마다 반영될 수 있도록 + path.ts file path resolve할 때 실제로 파일이 존재하는지 확인하는 작업
// 2. (2.2.0) suggest 기능 추가

export async function activate(context: vscode.ExtensionContext) {
  let vuexEntryUsageFiles = await buildSymbolTable();

  // allowed extensions: [js, ts, vue]
  const selector: vscode.DocumentSelector = [
    { language: "javascript", scheme: "file" },
    { language: "typescript", scheme: "file" },
    { language: "vue", scheme: "file" },
    { language: "plaintext", scheme: "file", pattern: "**/*.vue" }, // for test
  ];
  const provider = vscode.languages.registerDefinitionProvider(
    selector,
    new VuexDefinitionProvider()
  );
  context.subscriptions.push(provider);

  // all events are included: create / delete / rename / character change
  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(
    async (event) => {
      const isVuexEntryUsageFile = vuexEntryUsageFiles.some(
        (file) => file.fsPath === event.document.uri.fsPath
      );
      if (isVuexEntryUsageFile) {
        vuexEntryUsageFiles = await buildSymbolTable(); // rebuild symbol table
      } else {
        removeAst(event.document.uri.fsPath); // remove from cache
      }
    }
  );
  context.subscriptions.push(onDidChangeTextDocument);
}

export function deactivate() {}
