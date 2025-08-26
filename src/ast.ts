import * as vscode from "vscode";
import * as parser from "@babel/parser";
import { parse } from "@vue/compiler-sfc";
import type { File } from "@babel/types";
import { TextDecoder } from "node:util";

const astCache = new Map<string, parser.ParseResult<File>>(); // prevent re-parsing of the same file

function extractScriptFromVue(code: string): string | null {
  const { descriptor } = parse(code);

  if (descriptor.script) {
    // <script> block
    return descriptor.script.content;
  }
  if (descriptor.scriptSetup) {
    // <script setup> block
    return descriptor.scriptSetup.content;
  }

  return null;
}

export async function getAst(file: vscode.Uri) {
  const fileUriString = file.toString();
  if (astCache.has(fileUriString)) {
    return astCache.get(fileUriString);
  }

  try {
    const fileContent: Uint8Array = await vscode.workspace.fs.readFile(file);
    let code: string = new TextDecoder().decode(fileContent);

    // extract script content if the file is a Vue file
    if (file.fsPath.endsWith(".vue")) {
      const scriptContent = extractScriptFromVue(code);
      if (!scriptContent) {
        console.error(`No script tag found in Vue file: ${file.fsPath}`);
        return null;
      }
      code = scriptContent;
    }

    const ast = parser.parse(code, {
      sourceType: "module", // use es module system
      plugins: ["typescript"],
      errorRecovery: true, // ignore minor syntax errors
    });

    astCache.set(fileUriString, ast);

    return ast;
  } catch (error) {
    console.error(`Error parsing AST for ${file.fsPath}`, error);
    return null; // return null if file reading or parsing fails
  }
}

// TODO: cache clear 언제 추가로 할지 고민
export function clearAst(): void {
  astCache.clear();
}
