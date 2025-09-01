import * as vscode from "vscode";
import { VuexDefinitionProvider } from "./VuexDefinitionProvider";
import { buildSymbolTable } from "./table";
import { removeAst } from "./ast";

// [TODO]
// 1. 테스트 코드 수정: App2.vue 파일이 template으로 먼저 시작하게끔 변경 및 테스트 + 주석 추가
// 2. 위 수정 사항 1.0.1 배포 <= CHANGELOG 추가
// 3. 익스텐션 세부 정보에 manage extension 링크와 token 링크가 같이 있음
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
  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument((event) => {
    console.log(`cache remove for: ${event.document.uri}`);
    removeAst(event.document.uri);
  });
  context.subscriptions.push(onDidChangeTextDocument);
}

export function deactivate() {}
