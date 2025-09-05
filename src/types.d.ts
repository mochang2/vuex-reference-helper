import * as vscode from "vscode";
import * as parser from "@babel/parser";
import type { File } from "@babel/types";
import type { Node, NodePath } from "@babel/traverse";

export type VuexProperty =
  | "namespaced"
  | "state"
  | "getters"
  | "actions"
  | "mutations"
  | "modules";

export type VuexModuleEntity = {
  type: "modules";
  name: string;
  fileUri: vscode.Uri;
  position: vscode.Position;
  pastNamespaces: { name: string; isNamespaced: boolean | null }[];
};

export type VuexCommonEntity = {
  type: "state" | "getters" | "actions" | "mutations";
  name: string; // e.g. 'increment' or 'todo/getList'
  fileUri: vscode.Uri;
  position: vscode.Position;
};

export type VuexEntity = VuexModuleEntity | VuexCommonEntity;

export type PathConfig = {
  baseUrl: string;
  paths: Record<string, string[]>;
  type: "ts" | "js";
};

export type Ast = parser.ParseResult<File>;

export type AstResult = {
  ast: Ast;
  scriptStartLine: number;
};

export type StoreContext = {
  useStoreLocalName: string | null;
  storeLocalName: string | null;
};

export type TargetNodeInfo = {
  node: any;
  parent: any;
  path: NodePath<Node>;
  word: string;
};
