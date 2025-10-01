import * as vscode from "vscode";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { loadPathConfiguration, resolveModuleUri } from "./path";
import type { VuexProperty, VuexEntity } from "./types";
import type {
  ObjectExpression,
  ExportNamedDeclaration,
  File,
} from "@babel/types";
import { clearAst, getAst } from "./ast";

let symbolTable: VuexEntity[] = [];

const invalidFileGlob = "/[(node_modules)|(out)]/**";

export async function buildSymbolTable(): Promise<vscode.Uri[]> {
  // regard as createStore is declared not in vue file(currently not supported for vue)
  async function checkIfVuexEntry(
    file: vscode.Uri
  ): Promise<[true, string] | [false, null]> {
    const astResult = await getAst(file);
    if (!astResult) {
      return [false, null];
    }

    let hasVuexImport = false;
    let createStoreLocalName: string | null = null; // in case of import { createStore as cs }, remember the imported function name
    let isCreateStoreCalled = false;

    traverse(astResult.ast, {
      ImportDeclaration(path) {
        // find import statement of createStore like "import { createStore } from 'vuex'"
        if (path.node.source.value === "vuex") {
          for (const specifier of path.node.specifiers) {
            if (
              specifier.type === "ImportSpecifier" &&
              specifier.imported.type === "Identifier" &&
              specifier.imported.name === "createStore"
            ) {
              hasVuexImport = true;
              createStoreLocalName = specifier.local.name;

              return;
            }
          }
        }
      },
      CallExpression(path) {
        // find execution "createStore(...)" (including "export default createStore(...)")
        if (
          hasVuexImport &&
          path.node.callee.type === "Identifier" &&
          path.node.callee.name === createStoreLocalName
        ) {
          isCreateStoreCalled = true;

          return;
        }
      },
    });

    return [hasVuexImport && isCreateStoreCalled, createStoreLocalName];
  }

  async function findVuexEntry(): Promise<[vscode.Uri, string] | [null, null]> {
    const files = await vscode.workspace.findFiles(
      "src/**/*.[jt]s",
      invalidFileGlob
    ); // TODO(document): src 하위에 있는 부분만 분석함 + node_modules, out, output, dist 하위의 모든 파일 제외

    for (const file of files) {
      const [isVuexEntry, createStoreLocalName] = await checkIfVuexEntry(file);
      if (isVuexEntry) {
        return [file, createStoreLocalName];
      }
    }

    return [null, null];
  }

  async function parseModuleConfig(
    configObject: ObjectExpression,
    fileUri: vscode.Uri,
    ast: parser.ParseResult<File>, // ast of current file
    pastNamespaces: { name: string; isNamespaced: boolean | null }[]
  ): Promise<VuexEntity[]> {
    let results: VuexEntity[] = [];

    function collectNestedProperties(
      obj: ObjectExpression,
      pathStack: string[]
    ) {
      for (const member of obj.properties) {
        if (
          member.type === "ObjectProperty" &&
          member.key.type === "Identifier" &&
          member.key.loc
        ) {
          const name = member.key.name;
          const currentPath = [...pathStack, name];
          results.push({
            type: "state",
            name: currentPath.join("."), // e.g. "count" or "appSizeData.controllerSize"
            fileUri,
            position: new vscode.Position(
              member.key.loc.start.line - 1,
              member.key.loc.start.column
            ),
          });

          if (member.value.type === "ObjectExpression") {
            collectNestedProperties(member.value, currentPath);
          }
        }
      }
    }

    function collectProperties(
      obj: ObjectExpression,
      vuexType: "getters" | "mutations" | "actions",
      pathStack: string[]
    ) {
      for (const member of obj.properties) {
        if (
          (member.type === "ObjectProperty" ||
            member.type === "ObjectMethod") &&
          member.key.type === "Identifier" &&
          member.key.loc
        ) {
          results.push({
            type: vuexType,
            name:
              pathStack.length > 0
                ? `${pathStack.join("/")}/${member.key.name}`
                : member.key.name,
            fileUri,
            position: new vscode.Position(
              member.key.loc.start.line - 1,
              member.key.loc.start.column
            ),
          });
        }
      }
    }

    // check if "namespaced" property exists
    let isNamespaced = false;
    let currentNamespaces = [...pastNamespaces];
    for (const prop of configObject.properties) {
      if (
        prop.type === "ObjectProperty" &&
        prop.key.type === "Identifier" &&
        prop.key.name === "namespaced" &&
        prop.value.type === "BooleanLiteral"
      ) {
        isNamespaced = prop.value.value;
        break;
      }
    }
    if (pastNamespaces.length > 0) {
      // update "namespaced" property
      currentNamespaces[currentNamespaces.length - 1].isNamespaced =
        isNamespaced;

      // the symbol of module itself
      results.push({
        type: "modules",
        name: currentNamespaces[currentNamespaces.length - 1].name,
        fileUri,
        position: new vscode.Position(
          configObject.loc ? configObject.loc.start.line - 1 : 0,
          configObject.loc ? configObject.loc.start.column : 0
        ),
        pastNamespaces: [...currentNamespaces],
      });
    }

    // check other properties except "namespaced"
    for (const prop of configObject.properties) {
      if (
        prop.type !== "ObjectProperty" ||
        prop.key.type !== "Identifier" ||
        prop.value.type !== "ObjectExpression"
      ) {
        continue;
      }

      const vuexType = prop.key.name as VuexProperty;
      const value = prop.value;
      if (vuexType === "state") {
        collectNestedProperties(
          value,
          currentNamespaces.map(({ name }) => name)
        );
      } else if (
        vuexType === "getters" ||
        vuexType === "mutations" ||
        vuexType === "actions"
      ) {
        collectProperties(
          value,
          vuexType,
          currentNamespaces
            .filter(({ isNamespaced }) => isNamespaced)
            .map(({ name }) => name)
        );
      } else if (vuexType === "modules") {
        for (const moduleProp of value.properties) {
          if (
            moduleProp.type !== "ObjectProperty" ||
            moduleProp.key.type !== "Identifier" ||
            moduleProp.value.type !== "Identifier"
          ) {
            continue;
          }

          const moduleName = moduleProp.key.name; // modules: { key: value } key
          const moduleImportedName = moduleProp.value.name; // modules: { key: value } value

          // find import statement of module
          let moduleFileUri: vscode.Uri | null = null;
          let moduleExportedName = moduleProp.key.name;
          traverse(ast, {
            ImportDeclaration(path) {
              for (const specifier of path.node.specifiers) {
                if (specifier.local.name === moduleImportedName) {
                  if (
                    specifier.type === "ImportSpecifier" &&
                    specifier.imported.type === "Identifier"
                  ) {
                    moduleExportedName = specifier.imported.name; // in case of importedName !== exportedName
                  }
                  moduleFileUri = resolveModuleUri(
                    fileUri,
                    path.node.source.value
                  );
                  path.stop();
                }
              }
            },
          });

          if (!moduleFileUri) {
            continue;
          }

          const moduleAstResult = await getAst(moduleFileUri);
          if (!moduleAstResult) {
            continue;
          }

          // module's exported object
          let moduleConfigObject: ObjectExpression | null = null;
          traverse(moduleAstResult.ast, {
            ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
              const declaration = path.node.declaration;
              if (
                declaration?.type === "VariableDeclaration" &&
                declaration.declarations[0].id.type === "Identifier" &&
                declaration.declarations[0].id.name === moduleExportedName &&
                declaration.declarations[0].init?.type === "ObjectExpression"
              ) {
                moduleConfigObject = declaration.declarations[0].init;
                path.stop();
              }
            },

            ExportDefaultDeclaration(path) {
              const declaration = path.node.declaration;

              // export default { ... }
              if (declaration.type === "ObjectExpression") {
                moduleConfigObject = declaration;
                path.stop();
                return;
              }

              // const myStore = { ... }; export default myStore;
              if (declaration.type === "Identifier") {
                const binding = path.scope.getBinding(declaration.name);
                if (
                  binding &&
                  binding.path.isVariableDeclarator() &&
                  binding.path.node.init?.type === "ObjectExpression"
                ) {
                  moduleConfigObject = binding.path.node.init;
                  path.stop();
                }
              }
            },
          });

          if (moduleConfigObject) {
            const moduleResults = await parseModuleConfig(
              moduleConfigObject,
              moduleFileUri,
              moduleAstResult.ast,
              [...currentNamespaces, { name: moduleName, isNamespaced: null }]
            );
            results = results.concat(moduleResults);
          }
        }
      }
    }

    return results;
  }

  console.log("execute buildSymbolTable");

  clearAst();
  await loadPathConfiguration();

  const [vuexEntryFile, createStoreLocalName] = await findVuexEntry();
  if (!vuexEntryFile) {
    // vuex entry가 없음
    console.log("vuex entry file is not found");
    symbolTable = []; // 초기화

    return [];
  }

  const entryAstResult = await getAst(vuexEntryFile);
  if (!entryAstResult) {
    console.log("parsing vuex entry file failed");
    symbolTable = [];

    return [];
  }

  let rootConfigObject: ObjectExpression | null = null;
  traverse(entryAstResult.ast, {
    CallExpression(path) {
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === createStoreLocalName &&
        path.node.arguments[0]?.type === "ObjectExpression"
      ) {
        rootConfigObject = path.node.arguments[0];
        path.stop();
      }
    },
  });

  if (rootConfigObject) {
    symbolTable = await parseModuleConfig(
      rootConfigObject,
      vuexEntryFile,
      entryAstResult.ast,
      []
    );
    console.log("Symbol Table Built:", symbolTable);
  }
  // vuex entry file
  symbolTable.unshift({
    type: "modules",
    name: "", // no name
    fileUri: vuexEntryFile,
    position: new vscode.Position(0, 0), // no need to locate
    pastNamespaces: [],
  });

  return [];
}

export function querySymbolTable(
  condition: (symbol: VuexEntity) => boolean
): VuexEntity | undefined {
  return symbolTable.find((symbol) => condition(symbol));
}
