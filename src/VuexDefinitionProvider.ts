import * as vscode from "vscode";
import traverse from "@babel/traverse";
import { querySymbolTable } from "./table";
import { getAst } from "./ast";
import type { Node } from "@babel/traverse";

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
    const ast = await getAst(document.uri);
    if (!ast) {
      return null;
    }

    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    const word = document.getText(range); // remember selected part is a case of module itself

    let useStoreLocalName: string | null = null; // in case of import { useStore as cs }, remember the imported function name
    let storeLocalName: string | null = null; // in case of, const s = useStore() or const store = useStore(), remember the name of the variable
    let targetNodePath: any = null; // the smallest ast node

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

              return;
            }
          }
        }
      },
    });

    if (!useStoreLocalName) {
      return null;
    }

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

          return;
        }
      },
    });

    if (!storeLocalName) {
      return null;
    }

    traverse(ast, {
      enter(path) {
        const node = path.node;
        if (!node.loc) {
          return;
        }

        const cursorLine = position.line + 1;
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

    if (!targetNodePath || !targetNodePath.node || !targetNodePath.parent) {
      return null;
    }

    // store.commit("mutation") or store.getters["getter"] or store.commit("module/mutation") or store.getters["module/getter"] (using parentheses)
    // => locate to a mutation declaration or a getter declaration
    if (targetNodePath.node.type === "StringLiteral") {
      const parent = targetNodePath.parent;

      if (
        parent.type === "CallExpression" &&
        parent.callee.type === "MemberExpression" &&
        parent.callee.object.type === "Identifier" &&
        parent.callee.object.name === storeLocalName &&
        parent.callee.property.type === "Identifier" &&
        parent.callee.property.name === "commit"
      ) {
        const entity =
          querySymbolTable(word, "modules") ||
          querySymbolTable(targetNodePath.node.value, "mutations");
        if (entity) {
          return new vscode.Location(entity.fileUri, entity.position);
        }
      }

      if (
        parent.type === "MemberExpression" &&
        parent.computed === true &&
        parent.object.type === "MemberExpression" &&
        parent.object.object.type === "Identifier" &&
        parent.object.object.name === storeLocalName &&
        parent.object.property.type === "Identifier" &&
        parent.object.property.name === "getters"
      ) {
        const entity =
          querySymbolTable(word, "modules") ||
          querySymbolTable(targetNodePath.node.value, "getters");
        if (entity) {
          return new vscode.Location(entity.fileUri, entity.position);
        }
      }
    }

    // store.state.object.state or state.state.module.state (nested state)
    if (targetNodePath.node.type === "Identifier") {
      let parts: string[] = [word];
      let current = targetNodePath.parent;

      while (current && current.type === "MemberExpression") {
        if (
          current.property.type === "Identifier" &&
          current.property !== targetNodePath.node
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

      const entity = querySymbolTable(parts.join("."), "state");
      if (entity) {
        return new vscode.Location(entity.fileUri, entity.position);
      }
    }

    // store.state.module.state or store.getters.getter
    // => locate to a module declaration, a getter declaration, a mutation declaration or a state declaration
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
}
