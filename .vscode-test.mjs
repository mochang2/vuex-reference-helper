import { defineConfig } from "@vscode/test-cli";

export default defineConfig([
  {
    label: "js basic common integration tests",
    files: "out/test/js-basic.test.js",
    workspaceFolder: "./fixtures/js/basic",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "js basic common integration tests",
    files: "out/test/ts-basic.test.js",
    workspaceFolder: "./fixtures/ts/basic",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "js basic defintion integration tests",
    files: "out/test/defintion/js-basic.test.js",
    workspaceFolder: "./fixtures/js/basic",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "js extra defintion integration tests",
    files: "out/test/defintion/js-extra.test.js",
    workspaceFolder: "./fixtures/js/extra",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "ts basic defintion integration tests",
    files: "out/test/defintion/ts-basic.test.js",
    workspaceFolder: "./fixtures/ts/basic",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "ts extra defintion integration tests",
    files: "out/test/defintion/ts-extra.test.js",
    workspaceFolder: "./fixtures/ts/extra",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "js basic completion integration tests",
    files: "out/test/completion/js-basic.test.js",
    workspaceFolder: "./fixtures/js/basic",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "js extra completion integration tests",
    files: "out/test/completion/js-extra.test.js",
    workspaceFolder: "./fixtures/js/extra",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "ts basic completion integration tests",
    files: "out/test/completion/ts-basic.test.js",
    workspaceFolder: "./fixtures/ts/basic",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
  {
    label: "ts extra completion integration tests",
    files: "out/test/completion/ts-extra.test.js",
    workspaceFolder: "./fixtures/ts/extra",
    mocha: {
      timeout: 10000, // 10s
      slow: 2000, // 1s
    },
  },
]);
