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
]);
