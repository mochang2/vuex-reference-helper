import * as vscode from "vscode";
import * as path from "node:path";
import type { PathConfig } from "./types";

let pathConfig: PathConfig | null = null;

// to resolve module paths
export async function loadPathConfiguration(): Promise<void> {
  const configFiles = await vscode.workspace.findFiles(
    "{jsconfig,tsconfig}.json",
    "**/node_modules/**",
    1
  );

  if (configFiles.length === 0) {
    return;
  }

  // tsconfig.json firstly
  const configFile =
    configFiles.find((uri) => uri.fsPath.endsWith("tsconfig.json")) ||
    configFiles[0];

  try {
    const fileContent = await vscode.workspace.fs.readFile(configFile);
    const config = JSON.parse(new TextDecoder().decode(fileContent));
    const compilerOptions = config.compilerOptions;

    if (compilerOptions && compilerOptions.paths) {
      const configDir = path.dirname(configFile.fsPath);
      const baseUrl = path.resolve(configDir, compilerOptions.baseUrl || ".");

      pathConfig = {
        baseUrl,
        paths: compilerOptions.paths,
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

  // absolute path alias
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

  // resolve path
  if (!resolvedPathWithoutExt) {
    if (importPath.startsWith(".") || path.isAbsolute(importPath)) {
      const baseDir = path.dirname(baseFileUri.fsPath);
      resolvedPathWithoutExt = path.resolve(baseDir, importPath);
    } else {
      // regard as node_modules or node internal module(currently not supported for changed module names)
      return null;
    }
  }

  // not barrel file
  const possibleExtensions = [".js", ".ts"];
  for (const ext of possibleExtensions) {
    try {
      const fullPath = resolvedPathWithoutExt + ext;
      return vscode.Uri.file(fullPath);
    } catch {
      continue;
    }
  }

  // barrel file
  for (const ext of possibleExtensions) {
    try {
      const fullPath = path.join(resolvedPathWithoutExt, "index" + ext);
      return vscode.Uri.file(fullPath);
    } catch {
      continue;
    }
  }

  return null;
}
