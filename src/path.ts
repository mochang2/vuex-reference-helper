import * as vscode from "vscode";
import * as path from "node:path";
import * as fs from "node:fs";
import type { PathConfig } from "./types";

let pathConfig: PathConfig | null = null;

// resolve module paths
export async function loadPathConfiguration(): Promise<void> {
  async function resolveConfig(fileUri: vscode.Uri): Promise<any | null> {
    try {
      const fileContent = await vscode.workspace.fs.readFile(fileUri);
      return JSON.parse(new TextDecoder().decode(fileContent));
    } catch (error) {
      console.error("Error reading config file:", fileUri.fsPath, error);
      return null;
    }
  }

  async function findCompilerOptions(
    fileUri: vscode.Uri,
    visited = new Set<string>() // prevent circular reference
  ): Promise<Omit<PathConfig, "type"> | null> {
    if (visited.has(fileUri.fsPath)) {
      return null;
    }
    visited.add(fileUri.fsPath);

    const config = await resolveConfig(fileUri);
    if (!config) {
      return null;
    }

    if (config.compilerOptions && config.compilerOptions.paths) {
      const configDir = path.dirname(fileUri.fsPath);
      const baseUrl = path.resolve(
        configDir,
        config.compilerOptions.baseUrl || "."
      );
      return {
        baseUrl,
        paths: config.compilerOptions.paths,
      };
    }

    // search "references"
    if (Array.isArray(config.references)) {
      for (const ref of config.references) {
        if (ref.path) {
          const refPath = path.resolve(path.dirname(fileUri.fsPath), ref.path);
          const refFile = vscode.Uri.file(
            refPath.endsWith(".json") ? refPath : `${refPath}.json`
          );
          const result = await findCompilerOptions(refFile, visited);
          if (result) {
            return result;
          }
        }
      }
    }

    return null;
  }

  const configFiles = await vscode.workspace.findFiles(
    "{jsconfig,tsconfig}.json",
    "**/node_modules/**",
    1
  );

  if (configFiles.length === 0) {
    return;
  }

  const configFile = configFiles[0];
  const type = configFile.fsPath.endsWith("tsconfig.json") ? "ts" : "js";

  try {
    const result = await findCompilerOptions(configFiles[0]);
    if (result) {
      pathConfig = {
        ...result,
        type,
      };
    }
  } catch (error) {
    console.error("Error loading or parsing path configuration:", error);
  }
}

export function resolveModuleUri(
  baseFileUri: vscode.Uri,
  importPath: string
): vscode.Uri | null {
  let resolvedPathWithoutExt: string | null = null;

  // resolve path1 - if pathConfig exists
  if (pathConfig && pathConfig.paths) {
    for (const alias in pathConfig.paths) {
      const aliasPattern = alias.replace("*", ""); // e.g., '@/*' -> '@/'
      if (importPath.startsWith(aliasPattern)) {
        const pathSuffix = importPath.substring(aliasPattern.length);
        const resolvedPaths = pathConfig.paths[alias];
        for (const p of resolvedPaths) {
          const resolvedAliasPath = p.replace("*", pathSuffix);
          resolvedPathWithoutExt = path.join(
            pathConfig.baseUrl,
            resolvedAliasPath
          );
          break;
        }
        break;
      }
    }
  }

  // resolve path2 - if pathConfig not exists
  if (!resolvedPathWithoutExt) {
    const isRelative = importPath.startsWith(".");
    if (isRelative || path.isAbsolute(importPath)) {
      const baseDir = path.dirname(baseFileUri.fsPath);
      resolvedPathWithoutExt = path.resolve(baseDir, importPath);
    } else {
      // regard as node_modules or node internal module(currently not supported for changed module names)
      return null;
    }
  }

  // not barrel file
  try {
    let relativeRemovedImportPath = importPath;
    while (
      relativeRemovedImportPath.length > 0 &&
      relativeRemovedImportPath.startsWith(".")
    ) {
      relativeRemovedImportPath = relativeRemovedImportPath.slice(1);
    }

    const isImportPathIncludingExtension =
      relativeRemovedImportPath.includes(".");
    const fullPath = isImportPathIncludingExtension
      ? `${resolvedPathWithoutExt}`
      : `${resolvedPathWithoutExt}.${pathConfig?.type || "ts"}`; // tsconfig firstly
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return vscode.Uri.file(fullPath);
    }
  } catch {
    // do nothing
  }

  // barrel file
  try {
    const fullPath = path.join(
      resolvedPathWithoutExt,
      `index.${pathConfig?.type || "ts"}` // tsconfig firstly
    );
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return vscode.Uri.file(fullPath);
    }
  } catch {
    // do nothing
  }

  return null;
}
