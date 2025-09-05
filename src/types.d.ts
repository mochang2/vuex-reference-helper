import * as vscode from "vscode";
import * as parser from "@babel/parser";
import type { File } from "@babel/types";

export type VuexProperty =
  | "namespaced"
  | "state"
  | "getters"
  | "actions"
  | "mutations"
  | "modules";

export type VuexEntity =
  | {
      type: "modules";
      name: string;
      fileUri: vscode.Uri;
      position: vscode.Position;
      pastNamespaces: { name: string; isNamespaced: boolean | null }[];
    }
  | {
      type: "state" | "getters" | "actions" | "mutations";
      name: string; // e.g. 'increment' or 'todo/getList'
      fileUri: vscode.Uri;
      position: vscode.Position;
    };

export type PathConfig = {
  baseUrl: string;
  paths: Record<string, string[]>;
  type: "ts" | "js";
};

export type Ast = parser.ParseResult<File>;

export type AstResult = { 
  ast: Ast, 
  scriptStartLine: number 
};

export type StoreContext = {
  useStoreLocalName: string | null;
  storeLocalName: string | null;
}

export type TargetNodeInfo = {
  node: any;
  parent: any;
  word: string;
}
