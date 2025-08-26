import * as vscode from "vscode";
import { VuexDefinitionProvider } from "./VuexDefinitionProvider";
import { buildSymbolTable } from "./table";

// TODO: ts 프로젝트에서도 동작하는지 확인

export function activate(context: vscode.ExtensionContext) {
  buildSymbolTable(); // TODO: buildSymbolTable 내부 변수인 vuexEntryFile에 변화가 감지되면 재실행

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
}

export function deactivate() {}
