import * as vscode from "vscode";
import * as parser from "@babel/parser";
import { parse } from "@vue/compiler-sfc";
import { TextDecoder } from "node:util";
import type { AstResult } from "./types";

// to limit memory usage
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // move used item to the end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // remove the oldest item (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

const astCache = new LRUCache<string, AstResult>(100); // at most 100 files are cached

function extractScriptFromVue(
  code: string
): { content: string; startLine: number } | null {
  const { descriptor } = parse(code);
  const script = descriptor.script || descriptor.scriptSetup; // // <script> block || <script setup> block

  if (script) {
    return {
      content: script.content,
      startLine: script.loc.start.line - 1,
    };
  }

  return null;
}

export async function getAst(file: vscode.Uri): Promise<AstResult | null> {
  const filePath = file.fsPath;
  const cached = astCache.get(filePath);
  if (cached) {
    return cached;
  }

  try {
    const fileContent: Uint8Array = await vscode.workspace.fs.readFile(file);
    const fullCode: string = new TextDecoder().decode(fileContent);

    let codeToParse = fullCode;
    let scriptStartLine = 0; // 0 if not a vue file

    // extract script content if the file is a Vue file
    if (file.fsPath.endsWith(".vue")) {
      const scriptInfo = extractScriptFromVue(fullCode);
      if (!scriptInfo) {
        console.error(`No script tag found in Vue file: ${file.fsPath}`);
        return null;
      }
      codeToParse = scriptInfo.content;
      scriptStartLine = scriptInfo.startLine;
    }

    const ast = parser.parse(codeToParse, {
      sourceType: "module", // use es module system
      plugins: ["typescript"],
      errorRecovery: true, // ignore minor syntax errors
    });
    if (ast.errors && ast.errors.length > 0) {
      throw new Error("ast has errors"); // return null if ast has errors
    }

    const result = { ast, scriptStartLine };
    astCache.set(filePath, result);

    return result;
  } catch (error) {
    console.error(`Error parsing AST for ${file.fsPath}`, error);
    return null; // return null if file reading or parsing fails
  }
}

export function removeAst(filePath: string): void {
  if (astCache.has(filePath)) {
    console.log(`cache remove for: ${filePath}`);
    astCache.delete(filePath);
  }
}

export function clearAst(): void {
  astCache.clear();
}
