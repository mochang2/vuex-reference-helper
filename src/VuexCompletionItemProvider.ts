import * as vscode from "vscode";
import { getAllSymbols } from "./table";
import { getAst } from "./ast";
import { analyzeStoreContext } from "./storeContext";

export class VuexCompletionItemProvider
  implements vscode.CompletionItemProvider
{
  /**
   * handle in case that white spaces are included, such as the below patterns
   * " " = "any white space"
   * `${storeLocalName} . state . state1`;
   * `${storeLocalName} . state . state1 . state2`;
   * `${storeLocalName} . getters . getter`;
   * `${storeLocalName} . getters [ "module/getter" ] `;
   * `${storeLocalName} . commit ( "mutation" ) `;
   * `${storeLocalName} . commit ( "module/mutation" ) `;

   * but do not support like this format(template literal)
   * store.commit(`${zz}/ff`)
   */
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[] | undefined> {
    const astResult = await getAst(document.uri);
    if (!astResult) {
      return [];
    }

    const { useStoreLocalName, storeLocalName } = analyzeStoreContext(
      astResult.ast
    );
    if (!useStoreLocalName || !storeLocalName) {
      return [];
    }

    const { tokens, currentInputs } = this.getInputContext(
      document,
      position,
      storeLocalName
    );
    if (tokens.length === 0) {
      return [];
    }

    if (tokens[1] === "state") {
      return this.getStateCompletionItems(currentInputs);
    } else if (tokens[1] === "getters" && context.triggerCharacter === ".") {
      return this.getWithoutNamespaceGetterCompletionItems();
    } else if (
      tokens[1] === "getters" &&
      (context.triggerCharacter === "'" || context.triggerCharacter === '"')
    ) {
      return this.getWithNamespaceGetterCompletionItems(currentInputs);
    } else if (tokens[1] === "commit") {
      return this.getMutationCompletionItems(currentInputs);
    } else if (tokens[1] === "dispatch") {
      return this.getActionCompletionItems(currentInputs);
    }

    return [];
  }

  /**
   * ```
   * store
   *   .state
   *   .user.name|  <- | means the cursor position
   * ```
   * => extract into ["name", "user", "state", "store"]
   * => tokens is reversed: ["store", "state", "user", "name"]
   * => tokens[1] is one of the following: "state" | "getters" | "commit" | "dispatch"
   * => currentInput is the part of the text that is currently being input. In the above example, it is "name"
   */
  private getInputContext(
    document: vscode.TextDocument,
    position: vscode.Position,
    storeLocalName: string
  ): { tokens: string[]; currentInputs: string[] } {
    const tokens: string[] = [];
    let currentToken = "";
    let line = position.line;
    let char = position.character - 1;
    let isStoreContext = false;
    let isInString = false; // whether we are inside a string (reading backward), store.getters["getter"] or store.commit("mutation") or store.dispatch("action") and so on
    let stringChar: string | null = null; // quote character (', ")
    const maxIterations = 1000; // prevent infinite loop
    let iterations = 0;

    // read characters backward to extract tokens
    while (line >= 0 && iterations < maxIterations) {
      iterations++;

      if (char < 0) {
        // move to the previous line
        line--;
        if (line < 0) {
          break;
        }
        const prevLine = document.lineAt(line);
        char = prevLine.text.length - 1;
        continue;
      }

      const currentLine = document.lineAt(line);
      const ch = currentLine.text[char];

      if (isInString) {
        if (ch === stringChar) {
          // found opening quote (reading backward), exit string mode
          if (currentToken) {
            tokens.push(currentToken);
            currentToken = "";
          }
          isInString = false;
          stringChar = null;
        } else if (
          ch === "(" ||
          ch === "[" ||
          ch === ";" ||
          ch === "=" ||
          ch === ","
        ) {
          // incomplete string detected (e.g., store.commit("| where cursor is right after opening quote)
          // these characters should not appear inside a string in our context
          // exit string mode and save the current token if exists
          if (currentToken) {
            tokens.push(currentToken);
            currentToken = "";
          }
          isInString = false;
          stringChar = null;
          // don't skip this character, process it in the next iteration
          continue;
        } else if (ch === "\\") {
          // handle escape sequences - skip next char (previous in forward direction)
          char--;
          if (char >= 0) {
            currentToken = currentLine.text[char] + currentToken;
          }
        } else {
          // inside string, add character (including /)
          currentToken = ch + currentToken;
        }
      } else {
        if (ch === '"' || ch === "'") {
          // found closing quote (reading backward), enter string mode
          isInString = true;
          stringChar = ch;
        } else if (/[a-zA-Z0-9_$]/.test(ch)) {
          // identifier characters that are used for the name of the variable
          currentToken = ch + currentToken;
        } else if (ch === ".") {
          // dot(.) separator
          if (currentToken) {
            tokens.push(currentToken);

            if (currentToken === storeLocalName) {
              // if storeLocalName is found, exit
              isStoreContext = true;
              break;
            }

            currentToken = "";
          }

          if (char > 0 && currentLine.text[char - 1] === "?") {
            // check optional chaining (?.)
            char--;
          }
        } else if (ch === "(" || ch === "[") {
          // opening bracket/parenthesis (reading backward means closing in forward)
          // save current token if exists
          if (currentToken) {
            tokens.push(currentToken);

            if (currentToken === storeLocalName) {
              isStoreContext = true;
              break;
            }

            currentToken = "";
          }
          // continue reading
        } else if (ch === ")" || ch === "]") {
          // closing bracket/parenthesis (reading backward means opening in forward)
          // ignore and continue
        } else if (/[\s\n\r\t]/.test(ch)) {
          // ignore white spaces, tabs, new lines
          if (currentToken) {
            tokens.push(currentToken);
            if (currentToken === storeLocalName) {
              // if storeLocalName is found, exit
              isStoreContext = true;
              break;
            }
            currentToken = "";
          }
        } else {
          // if other characters are encountered, stop (semicolons, operators, etc.)
          if (currentToken) {
            tokens.push(currentToken);

            if (currentToken === storeLocalName) {
              // if storeLocalName is found, exit
              isStoreContext = true;
              break;
            }
          }
          break;
        }
      }

      char--;
    }

    // handle the last token
    if (currentToken && !isStoreContext) {
      tokens.push(currentToken);
      if (currentToken === storeLocalName) {
        isStoreContext = true;
      }
    }

    if (!isStoreContext || tokens.length < 1) {
      return {
        tokens: [],
        currentInputs: [],
      };
    }

    const orderedTokens = [...tokens].reverse();
    return {
      tokens: orderedTokens,
      currentInputs: orderedTokens.length === 2 ? [] : orderedTokens.slice(2),
    };
  }

  private getStateCompletionItems(
    currentInputs: string[]
  ): vscode.CompletionItem[] {
    const prefix =
      currentInputs.length === 0 ? "" : `${currentInputs.join(".")}.`;
    const items = getAllSymbols()
      .filter((symbol) => symbol.type === "state")
      .filter((symbol) => symbol.name.startsWith(prefix))
      .map((symbol) => {
        const completionItem = new vscode.CompletionItem(
          symbol.name.substring(prefix.length),
          vscode.CompletionItemKind.Variable
        );
        completionItem.detail = `State: ${symbol.name}`;
        completionItem.documentation = `Vuex state is defined in ${symbol.fileUri.path}`;

        return completionItem;
      });

    return this.finalizeCompletionItems(items);
  }

  private getWithoutNamespaceGetterCompletionItems(): vscode.CompletionItem[] {
    const items = getAllSymbols()
      .filter((symbol) => symbol.type === "getters")
      .filter((symbol) => !symbol.name.includes("/"))
      .map((symbol) => {
        const completionItem = new vscode.CompletionItem(
          symbol.name,
          vscode.CompletionItemKind.Function
        );
        completionItem.detail = `Getter: ${symbol.name}`;
        completionItem.documentation = `Vuex getter is defined in ${symbol.fileUri.path}`;

        return completionItem;
      });

    return this.finalizeCompletionItems(items);
  }

  private getWithNamespaceGetterCompletionItems(
    currentInputs: string[]
  ): vscode.CompletionItem[] {
    const prefix =
      currentInputs.length === 0 ? "" : `${currentInputs.join("/")}/`;
    const items = getAllSymbols()
      .filter((symbol) => symbol.type === "getters")
      .filter((symbol) => symbol.name.startsWith(prefix))
      .map((symbol) => {
        const completionItem = new vscode.CompletionItem(
          symbol.name.substring(prefix.length),
          vscode.CompletionItemKind.Function
        );
        completionItem.detail = `Getter: ${symbol.name}`;
        completionItem.documentation = `Vuex getter is defined in ${symbol.fileUri.path}`;

        return completionItem;
      });

    return this.finalizeCompletionItems(items);
  }

  private getMutationCompletionItems(
    currentInputs: string[]
  ): vscode.CompletionItem[] {
    const prefix =
      currentInputs.length === 0 ? "" : `${currentInputs.join("/")}/`;
    const items = getAllSymbols()
      .filter((symbol) => symbol.type === "mutations")
      .filter((symbol) => symbol.name.startsWith(prefix))
      .map((symbol) => {
        const completionItem = new vscode.CompletionItem(
          symbol.name.substring(prefix.length),
          vscode.CompletionItemKind.Function
        );
        completionItem.detail = `Mutation: ${symbol.name}`;
        completionItem.documentation = `Vuex mutation is defined in ${symbol.fileUri.path}`;

        return completionItem;
      });

    return this.finalizeCompletionItems(items);
  }

  private getActionCompletionItems(
    currentInputs: string[]
  ): vscode.CompletionItem[] {
    const prefix =
      currentInputs.length === 0 ? "" : `${currentInputs.join("/")}/`;
    const items = getAllSymbols()
      .filter((symbol) => symbol.type === "actions")
      .filter((symbol) => symbol.name.startsWith(prefix))
      .map((symbol) => {
        const completionItem = new vscode.CompletionItem(
          symbol.name.substring(prefix.length),
          vscode.CompletionItemKind.Function
        );
        completionItem.detail = `Action: ${symbol.name}`;
        completionItem.documentation = `Vuex action is defined in ${symbol.fileUri.path}`;

        return completionItem;
      });

    return this.finalizeCompletionItems(items);
  }

  // show completion items at the top of the suggestion list
  private finalizeCompletionItems(
    items: vscode.CompletionItem[]
  ): vscode.CompletionItem[] {
    if (items.length > 0) {
      items[0].preselect = true;
    }
    return items;
  }
}
