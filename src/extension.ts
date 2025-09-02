import * as vscode from "vscode";
import { VuexDefinitionProvider } from "./VuexDefinitionProvider";
import { buildSymbolTable } from "./table";
import { removeAst } from "./ast";

// [TODO]
// 4. cursor에도 올릴 수 있도록 수정
// 5. 테스트 코드 작성. actions 추가해서 1.1.0 배포
// 6. vuexEntryFile에 변경이 생길 때마다 반영될 수 있도록 1.1.1 수정해서 배포
// 7. suggest 기능 추가해서 1.2.0 배포

export function activate(context: vscode.ExtensionContext) {
  buildSymbolTable();

  // allowed extensions: [js, ts, vue]
  const selector: vscode.DocumentSelector = [
    { language: "javascript", scheme: "file" },
    { language: "typescript", scheme: "file" },
    { language: "vue", scheme: "file" },
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
