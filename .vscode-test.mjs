import { defineConfig } from "@vscode/test-cli";

export default defineConfig([
  {
    label: "js basic defintion integration tests",
    files: "out/test/defintion/js-basic.test.js",
    workspaceFolder: "./fixtures/definition/js/basic",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "js extra defintion integration tests",
    files: "out/test/defintion/js-extra.test.js",
    workspaceFolder: "./fixtures/definition/js/extra",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "ts basic defintion integration tests",
    files: "out/test/defintion/ts-basic.test.js",
    workspaceFolder: "./fixtures/definition/ts/basic",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "ts extra defintion integration tests",
    files: "out/test/defintion/ts-extra.test.js",
    workspaceFolder: "./fixtures/definition/ts/extra",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
]);
