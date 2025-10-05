import traverse from "@babel/traverse";
import type { Ast, StoreContext } from "./types";

export function analyzeStoreContext(ast: Ast): StoreContext {
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
  const storeLocalName = useStoreLocalName
    ? findStoreLocalName(useStoreLocalName)
    : null;

  return {
    useStoreLocalName,
    storeLocalName,
  };
}
