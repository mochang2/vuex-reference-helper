import * as vscode from "vscode";
import * as parser from "@babel/parser";
import type { File } from "@babel/types";

export type VuexProperty =
  | "state"
  | "getters"
  | "mutations"
  | "modules"
  | "namespaced";

export type VuexEntity =
  | {
      type: "modules";
      name: string;
      fileUri: vscode.Uri;
      position: vscode.Position;
      pastNamespaces: { name: string; isNamespaced: boolean | null }[];
    }
  | {
      type: "state" | "getters" | "mutations";
      name: string; // e.g. 'increment' or 'todo/getList'
      fileUri: vscode.Uri;
      position: vscode.Position;
    };

export type PathConfig = {
  baseUrl: string;
  paths: Record<string, string[]>;
  type: "ts" | "js";
};

export type AstResult = {
  ast: parser.ParseResult<File>;
  scriptStartLine: number;
};
