import * as vscode from "vscode";
import traverse from "@babel/traverse";
import { querySymbolTable } from "./table";
import { getAst } from "./ast";
import { analyzeStoreContext } from "./storeContext";
import type { Node, NodePath } from "@babel/traverse";
import type { VuexModuleEntity, Ast, TargetNodeInfo } from "./types";

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
    const astResult = await getAst(document.uri);
    if (!astResult) {
      return null;
    }

    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    const targetNodePath = this.findTargetNodePath(
      astResult.ast,
      position,
      astResult.scriptStartLine
    ); // the smallest ast node
    if (!targetNodePath) {
      return null;
    }

    const word = document.getText(range); // remember selected part is a case of module itself
    const storeContext = analyzeStoreContext(astResult.ast); // in case of import { useStore as cs }, remember the imported function name, in case of, const s = useStore() or const store = useStore(), remember the name of the variable
    const targetNodeInfo: TargetNodeInfo = {
      node: targetNodePath.node,
      parent: targetNodePath.parent,
      path: targetNodePath,
      word,
    };

    // store.dispatch("action") or store.commit("mutation") or store.getters["getter"] or store.dispatch("module/action") or store.commit("module/mutation") or store.getters["module/getter"] (using parentheses)
    // => locate to a mutation declaration or a getter declaration or a module declaration
    if (targetNodePath.node.type === "StringLiteral") {
      const result = this.handleStringLiteral(
        targetNodeInfo,
        storeContext.storeLocalName,
        document.uri.path
      );
      if (result) {
        return result;
      }
    }

    // store.state.object.state or state.state.module.state or store.getters.getter
    // => locate to a state declaration or a getter declaration or a module declaration
    if (targetNodePath.node.type === "Identifier") {
      const result = this.handleIdentifier(
        targetNodeInfo,
        storeContext.storeLocalName,
        document.uri.path
      );
      if (result) {
        return result;
      }
    }

    return null;
  }

  private findTargetNodePath(
    ast: Ast,
    position: vscode.Position,
    scriptStartLine: number
  ): NodePath<Node> | null {
    let targetNodePath: NodePath<Node> | null = null;

    traverse(ast, {
      enter: (path) => {
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
          if (
            !targetNodePath ||
            this.isNodeSmaller(node, targetNodePath.node)
          ) {
            targetNodePath = path;
          }
        }
      },
    });

    return targetNodePath;
  }

  private isNodeSmaller(nodeA: Node, nodeB: Node): boolean {
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

  private handleStringLiteral(
    targetNodeInfo: TargetNodeInfo,
    storeLocalName: string | null,
    documentPath: string
  ): vscode.Location | null {
    if (storeLocalName) {
      if (this.isMutationCall(targetNodeInfo.parent, storeLocalName)) {
        const entity =
          querySymbolTable(
            (symbol) =>
              symbol.name === targetNodeInfo.word && symbol.type === "modules"
          ) ||
          querySymbolTable(
            (symbol) =>
              symbol.name === targetNodeInfo.node.value &&
              symbol.type === "mutations"
          );
        if (entity) {
          return new vscode.Location(entity.fileUri, entity.position);
        }
      }

      if (this.isActionCall(targetNodeInfo.parent, storeLocalName)) {
        const entity =
          querySymbolTable(
            (symbol) =>
              symbol.name === targetNodeInfo.word && symbol.type === "modules"
          ) ||
          querySymbolTable(
            (symbol) =>
              symbol.name === targetNodeInfo.node.value &&
              symbol.type === "actions"
          );
        if (entity) {
          return new vscode.Location(entity.fileUri, entity.position);
        }
      }

      if (this.isGetterCall(targetNodeInfo.parent, storeLocalName)) {
        const entity =
          querySymbolTable(
            (symbol) =>
              symbol.name === targetNodeInfo.word && symbol.type === "modules"
          ) ||
          querySymbolTable(
            (symbol) =>
              symbol.name === targetNodeInfo.node.value &&
              symbol.type === "getters"
          );
        if (entity) {
          return new vscode.Location(entity.fileUri, entity.position);
        }
      }
    }

    const module = querySymbolTable(
      (symbol) =>
        symbol.fileUri.path === documentPath && symbol.type === "modules"
    ) as VuexModuleEntity;
    if (module) {
      // action -> mutation call or action -> action call
      return this.handleActionContextCall(targetNodeInfo, module);
    }

    return null;
  }

  private isMutationCall(parent: any, storeLocalName: string): boolean {
    return (
      parent.type === "CallExpression" &&
      parent.callee.type === "MemberExpression" &&
      parent.callee.object.type === "Identifier" &&
      parent.callee.object.name === storeLocalName &&
      parent.callee.property.type === "Identifier" &&
      parent.callee.property.name === "commit"
    );
  }

  private isActionCall(parent: any, storeLocalName: string): boolean {
    return (
      parent.type === "CallExpression" &&
      parent.callee.type === "MemberExpression" &&
      parent.callee.object.type === "Identifier" &&
      parent.callee.object.name === storeLocalName &&
      parent.callee.property.type === "Identifier" &&
      parent.callee.property.name === "dispatch"
    );
  }

  private isGetterCall(parent: any, storeLocalName: string): boolean {
    return (
      parent.type === "MemberExpression" &&
      parent.computed === true &&
      parent.object.type === "MemberExpression" &&
      parent.object.object.type === "Identifier" &&
      parent.object.object.name === storeLocalName &&
      parent.object.property.type === "Identifier" &&
      parent.object.property.name === "getters"
    );
  }

  private handleActionContextCall(
    targetNodeInfo: TargetNodeInfo,
    module: VuexModuleEntity
  ): vscode.Location | null {
    if (targetNodeInfo.parent.type !== "CallExpression") {
      return null;
    }

    const functionParent = targetNodeInfo.path.getFunctionParent();
    if (!functionParent) {
      return null;
    }

    let callName: "commit" | "dispatch" | null = null;

    // in case of action({ dispatch }) or action({ commit }) - destructured
    if (targetNodeInfo.parent.callee.type === "Identifier") {
      callName = targetNodeInfo.parent.callee.name as "commit" | "dispatch";
    }
    // in case of action(context) { context.commit('...') } or action(a) { a.dispatch('...') } - not destructured
    else if (
      targetNodeInfo.parent.callee.type === "MemberExpression" &&
      targetNodeInfo.parent.callee.object.type === "Identifier" &&
      targetNodeInfo.parent.callee.property.type === "Identifier"
    ) {
      callName = targetNodeInfo.parent.callee.property.name as
        | "commit"
        | "dispatch";
    }

    if (!callName || (callName !== "commit" && callName !== "dispatch")) {
      return null;
    }

    // check if the "actions" object is an ancestor
    let currentPath = functionParent.parentPath;
    let isInActionsContext = false;
    let loopIterationGuard = 10; // prevent infinite loops
    while (currentPath && loopIterationGuard > 0) {
      if (
        currentPath.node.type === "ObjectProperty" &&
        currentPath.node.key.type === "Identifier" &&
        currentPath.node.key.name === "actions"
      ) {
        isInActionsContext = true;
        break;
      }
      if (!currentPath.parentPath) {
        break;
      }

      currentPath = currentPath.parentPath;
      loopIterationGuard--;
    }

    if (!isInActionsContext) {
      return null;
    }

    const validNamespaces = module.pastNamespaces.filter(
      ({ isNamespaced }) => isNamespaced
    );
    const name =
      validNamespaces.length > 0
        ? `${validNamespaces.map(({ name }) => name).join("/")}/${
            targetNodeInfo.word
          }`
        : targetNodeInfo.word;
    const type = callName === "commit" ? "mutations" : "actions";
    const entity = querySymbolTable(
      (symbol) => symbol.name === name && symbol.type === type
    );
    if (entity) {
      return new vscode.Location(entity.fileUri, entity.position);
    }

    return null;
  }

  private handleIdentifier(
    targetNodeInfo: TargetNodeInfo,
    storeLocalName: string | null,
    documentPath: string
  ): vscode.Location | null {
    if (storeLocalName) {
      const statePath = this.buildStatePath(targetNodeInfo, storeLocalName);
      const stateEntity =
        querySymbolTable(
          (symbol) =>
            symbol.name === targetNodeInfo.word && symbol.type === "modules"
        ) ||
        querySymbolTable(
          (symbol) => symbol.name === statePath && symbol.type === "state"
        );
      if (stateEntity) {
        return new vscode.Location(stateEntity.fileUri, stateEntity.position);
      }

      const getterPath = this.buildGetterPath(targetNodeInfo);
      const getterEntity = querySymbolTable(
        (symbol) => symbol.name === getterPath && symbol.type === "getters"
      );
      if (getterEntity) {
        return new vscode.Location(getterEntity.fileUri, getterEntity.position);
      }
    }

    const module = querySymbolTable(
      (symbol) =>
        symbol.fileUri.path === documentPath && symbol.type === "modules"
    ) as VuexModuleEntity;
    if (module) {
      return this.handleModuleStateIdentifier(targetNodeInfo, module);
    }

    return null;
  }

  private buildStatePath(
    targetNodeInfo: TargetNodeInfo,
    storeLocalName: string
  ): string {
    let parts: string[] = [targetNodeInfo.word];
    let current = targetNodeInfo.parent;

    while (
      current &&
      (current.type === "MemberExpression" ||
        current.type === "OptionalMemberExpression" ||
        current.type === "TSNonNullExpression")
    ) {
      if (
        current.property?.type === "Identifier" &&
        current.property !== targetNodeInfo.node
      ) {
        if (
          current.property?.name === storeLocalName ||
          current.property?.name === "state"
        ) {
          break;
        }
        parts.unshift(current.property?.name);
      } else if (current.object?.type === "Identifier") {
        parts.unshift(current.object?.name);
        break;
      }

      current = current.object || current.expression;
    }

    return parts.join(".");
  }

  private buildGetterPath(targetNodeInfo: TargetNodeInfo): string {
    const parent = targetNodeInfo.parent.object || targetNodeInfo.parent.expression;
    if (parent.property.type === "Identifier" && parent.property.name === "getters") {
      return targetNodeInfo.word;
    }

    return "";
  }

  private handleModuleStateIdentifier(
    targetNodeInfo: TargetNodeInfo,
    module: VuexModuleEntity
  ): vscode.Location | null {
    const functionParentPath = targetNodeInfo.path.getFunctionParent();
    if (!functionParentPath) {
      return null;
    }

    const firstParam = functionParentPath.node.params[0];
    if (!firstParam || firstParam.type !== "Identifier") {
      return null;
    }
    const stateParamName = firstParam.name; // e.g., 'state', 'st', 's'

    let currentPath = functionParentPath.parentPath;
    let isInGettersOrMutationsContext = false;
    let loopIterationGuard = 10; // prevent infinite loops
    while (currentPath && loopIterationGuard > 0) {
      if (
        currentPath.node.type === "ObjectProperty" &&
        currentPath.node.key.type === "Identifier" &&
        (currentPath.node.key.name === "getters" ||
          currentPath.node.key.name === "mutations")
      ) {
        isInGettersOrMutationsContext = true;
        break;
      }
      if (!currentPath.parentPath) {
        break;
      }

      currentPath = currentPath.parentPath;
      loopIterationGuard--;
    }

    if (!isInGettersOrMutationsContext) {
      return null;
    }

    let parts: string[] = [targetNodeInfo.word];
    let current = targetNodeInfo.parent;
    while (current && current.type === "MemberExpression") {
      if (
        current.property.type === "Identifier" &&
        current.property !== targetNodeInfo.node
      ) {
        if (current.property.name === stateParamName) {
          break;
        }
        parts.unshift(current.property.name);
      }

      current = current.object;
    }

    const validNamespaces = module.pastNamespaces.filter(
      ({ isNamespaced }) => isNamespaced
    );
    const name =
      validNamespaces.length > 0
        ? `${validNamespaces.map(({ name }) => name).join(".")}.${
            targetNodeInfo.word
          }`
        : targetNodeInfo.word;
    const entity = querySymbolTable(
      (symbol) => symbol.name === name && symbol.type === "state"
    );
    if (entity) {
      return new vscode.Location(entity.fileUri, entity.position);
    }

    return null;
  }
}
