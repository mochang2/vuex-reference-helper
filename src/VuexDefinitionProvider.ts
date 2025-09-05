import * as vscode from "vscode";
import traverse from "@babel/traverse";
import { querySymbolTable } from "./table";
import { getAst } from "./ast";
import type { Node } from "@babel/traverse";
import type { Ast, StoreContext, TargetNodeInfo } from "./types";

export class VuexDefinitionProvider implements vscode.DefinitionProvider {
  // handle in case that white spaces are included, such as the below patterns
  // " " = "any white space"
  // `${storeLocalName} . state . state1`;
  // `${storeLocalName} . state . state1 . state2`;
  // `${storeLocalName} . getters . getter`;
  // `${storeLocalName} . getters [ "module/getter" ] `;
  // `${storeLocalName} . commit ( "mutation" ) `;
  // `${storeLocalName} . commit ( "module/mutation" ) `;

  // but do not support like this format(abnormal line break)
  // store.commit("zz/ff\
  // vv")
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Definition | vscode.LocationLink[] | null> {
    function findTargetNodePath(ast: Ast, position: vscode.Position, scriptStartLine: number): any {
      function isNodeSmaller(nodeA: Node, nodeB: Node): boolean {
        if (!nodeA.loc || !nodeB.loc) {
          return false;
        }

        const sizeA =
          (nodeA.loc.end.line - nodeA.loc.start.line) * 1000 +
          (nodeA.loc.end.column - nodeA.loc.start.column);
        const sizeB =
          (nodeB.loc.end.line - nodeB.loc.start.line) * 1000 +
          (nodeB.loc.end.column - nodeB.loc.start.column);

        return sizeA < sizeB;
      }

      let targetNodePath: any = null;

      traverse(ast, {
        enter(path) {
          const node = path.node;
          if (!node.loc) {
            return;
          }

          const cursorLine = position.line - scriptStartLine + 1;
          const cursorChar = position.character;

          if (
            cursorLine >= node.loc.start.line &&
            cursorLine <= node.loc.end.line &&
            (cursorLine > node.loc.start.line ||
              cursorChar >= node.loc.start.column) &&
            (cursorLine < node.loc.end.line || cursorChar <= node.loc.end.column)
          ) {
            if (!targetNodePath || isNodeSmaller(node, targetNodePath.node)) {
              targetNodePath = path;
            }
          }
        },
      });

      return targetNodePath;
    }

    function analyzeStoreContext(ast: Ast): StoreContext {
      function findUseStoreLocalName(): string | null {
        let useStoreLocalName: string | null = null;

        traverse(ast, {
          ImportDeclaration(path) {
            if (path.node.source.value === "vuex") {
              for (const specifier of path.node.specifiers) {
                if (
                  specifier.type === "ImportSpecifier" &&
                  specifier.imported.type === "Identifier" &&
                  specifier.imported.name === "useStore"
                ) {
                  useStoreLocalName = specifier.local.name;
                  path.stop();
                }
              }
            }
          },
        });

        return useStoreLocalName;
      }

      function findStoreLocalName(useStoreLocalName: string): string | null {
        let storeLocalName: string | null = null;

        traverse(ast, {
          CallExpression(path) {
            if (
              path.node.callee.type === "Identifier" &&
              path.node.callee.name === useStoreLocalName &&
              path.parent.type === "VariableDeclarator" &&
              path.parent.id.type === "Identifier"
            ) {
              storeLocalName = path.parent.id.name;
              path.stop();
            }
          },
        });

        return storeLocalName;
      }

      const useStoreLocalName = findUseStoreLocalName();
      const storeLocalName = useStoreLocalName ? findStoreLocalName(useStoreLocalName) : null;

      return {
        useStoreLocalName,
        storeLocalName,
      };
    }

    function handleStringLiteral(targetNodeInfo: TargetNodeInfo, storeLocalName: string | null): vscode.Location | null {
      function isMutationCall(parent: any): boolean {
        return parent.type === "CallExpression"
          && parent.callee.type === "MemberExpression"
          && parent.callee.object.type === "Identifier"
          && parent.callee.object.name === storeLocalName
          && parent.callee.property.type === "Identifier"
          && parent.callee.property.name === "commit";
      }

      function isActionCall(parent: any): boolean {
        return parent.type === "CallExpression"
          && parent.callee.type === "MemberExpression"
          && parent.callee.object.type === "Identifier"
          && parent.callee.object.name === storeLocalName
          && parent.callee.property.type === "Identifier"
          && parent.callee.property.name === "dispatch";
      }

      function isGetterCall(parent: any): boolean {
        return parent.type === "MemberExpression"
          && parent.computed === true
          && parent.object.type === "MemberExpression"
          && parent.object.object.type === "Identifier"
          && parent.object.object.name === storeLocalName
          && parent.object.property.type === "Identifier"
          && parent.object.property.name === "getters";
      }

      const { node, parent, word } = targetNodeInfo;

      if (isMutationCall(parent)) {
        const entity = querySymbolTable(word, "modules") || querySymbolTable(node.value, "mutations");
        if (entity) {
          return new vscode.Location(entity.fileUri, entity.position);
        }
      }

      if (isActionCall(parent)) {
        const entity = querySymbolTable(word, "modules") || querySymbolTable(node.value, "actions");
        if (entity) {
          return new vscode.Location(entity.fileUri, entity.position);
        }
      }

      if (isGetterCall(parent)) {
        const entity = querySymbolTable(word, "modules") || querySymbolTable(node.value, "getters");
        if (entity) {
          return new vscode.Location(entity.fileUri, entity.position);
        }
      }

      return null;
    }

    function handleIdentifier(targetNodeInfo: TargetNodeInfo, storeLocalName: string | null): vscode.Location | null {
      function buildStatePath(): string {
        const { node, parent, word } = targetNodeInfo;
        let parts: string[] = [word];
        let current = parent;

        while (current && current.type === "MemberExpression") {
          if (
            current.property.type === "Identifier" &&
            current.property !== node
          ) {
            if (
              current.property.name === storeLocalName ||
              current.property.name === "state" ||
              current.property.name === "getters"
            ) {
              break;
            }
            parts.unshift(current.property.name);
          } else if (current.object.type === "Identifier") {
            parts.unshift(current.object.name);
            break;
          }

          current = current.object;
        }

        return parts.join(".");
      }

      const statePath = buildStatePath();
      const entity = querySymbolTable(statePath, "state");
      
      if (entity) {
        return new vscode.Location(entity.fileUri, entity.position);
      }

      return null;
    }

    function handleTextItself(word: string): vscode.Location | null {
      const entity =
        querySymbolTable(word, "modules") ||
        querySymbolTable(word, "getters") ||
        querySymbolTable(word, "mutations") ||
        querySymbolTable(word, "state");
      
      if (entity) {
        return new vscode.Location(entity.fileUri, entity.position);
      }

      return null;
    }

    const astResult = await getAst(document.uri);
    if (!astResult) {
      return null;
    }

    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    const targetNodePath = findTargetNodePath(astResult.ast, position, astResult.scriptStartLine); // the smallest ast node
    if (!targetNodePath || !targetNodePath.node || !targetNodePath.parent) {
      return null;
    }

    const word = document.getText(range); // remember selected part is a case of module itself
    const storeContext = analyzeStoreContext(astResult.ast); // in case of import { useStore as cs }, remember the imported function name, in case of, const s = useStore() or const store = useStore(), remember the name of the variable
    const targetNodeInfo: TargetNodeInfo = {
      node: targetNodePath.node,
      parent: targetNodePath.parent,
      word,
    };

    // store.dispatch("action") or store.commit("mutation") or store.getters["getter"] or store.dispatch("module/action") or store.commit("module/mutation") or store.getters["module/getter"] (using parentheses)
    // => locate to a mutation declaration or a getter declaration
    if (targetNodePath.node.type === "StringLiteral") {
      const result = handleStringLiteral(targetNodeInfo, storeContext.storeLocalName);
      if (result) {
        return result;
      }
    }

    // store.state.object.state or state.state.module.state (nested state)
    if (targetNodePath.node.type === "Identifier") {
      const result = handleIdentifier(targetNodeInfo, storeContext.storeLocalName);
      if (result) {
        return result;
      }
    }

    // store.state.module.state or store.getters.getter
    // => locate to a module declaration, a getter declaration, a mutation declaration or a state declaration
    return handleTextItself(word);
  }
}
