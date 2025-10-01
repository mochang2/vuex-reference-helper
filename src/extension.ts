import * as vscode from "vscode";
import { VuexDefinitionProvider } from "./VuexDefinitionProvider";
import { buildSymbolTable } from "./table";
import { removeAst } from "./ast";

// [TODO]
// 1. (2.0.0) 테스트 코드 작성, 제공 버전 수정(^1.102 -> ^1.99)
// 2. (2.0.1) store?.getters!. 이러한 경우에 대한 예외 처리 작업
// 3. (2.1.0) vuexEntryFile에 변경이 생길 때마다 반영될 수 있도록 + path.ts file path resolve할 때 실제로 파일이 존재하는지 확인하는 작업
// 4. (2.2.0) suggest 기능 추가

export function activate(context: vscode.ExtensionContext) {
  buildSymbolTable();

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

  // if a file is changed, remove it from the cache
  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      console.log(`cache remove for: ${event.document.uri}`);
      removeAst(event.document.uri);
    }
  );
  context.subscriptions.push(onDidChangeTextDocument);
}

export function deactivate() {}
