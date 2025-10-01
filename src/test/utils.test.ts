import * as vscode from "vscode";

export async function waitForLoadingExtension() {
  const extension = vscode.extensions.getExtension(
    "qjsrodksro.vuex-reference-helper"
  ) as vscode.Extension<any>;

  if (!extension.isActive) {
    await extension.activate();
  }
  
  // Wait a bit more to ensure symbol table is fully built
  await new Promise((resolve) => setTimeout(resolve, 100));
}
