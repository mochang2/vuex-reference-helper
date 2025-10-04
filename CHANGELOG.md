# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2025.10.04

### Added

- Enable a function to rebuild the vuex symbol table when the vuex usage files are changed

### Fixed

- Change a path resolution to check if the file actually exists
- Change ast cache key to identify files easily
  - `vscode.Uri.toString()` -> `vscode.Uri.fsPath`

## [2.0.1] - 2025.10.02

### Fixed

- Support the optional chaining and the non-null assertion operation
  - ex. `store.state.module?.state` or `store?.state?.object1!.key`

## [2.0.0] - 2025.10.01

### Changed

- Change supported VS code engine version
  - `^1.102.0` -> `^1.99.0`

### Fixed

- Change the misleading of the `getters` to the definition of `state`, when the name of the `state` is same with the name of the `getters`

## [1.1.0] - 2025.09.05

### Added

- Additionally enabled Ctrl/Cmd + Click navigation to Vuex definitions:
  - `actions`

### Fixed

- Support navigating states, getters, mutations and actions within a store file

## [1.0.1] - 2025.09.01

### Fixed

- Remove ast cache while a document is changed(prevent to reload vscode to update ast cache).
- Change `.vue` files to function normally even if it does not start with a script tag.

## [1.0.0] - 2025.08.31

### Added

- Initial release of Vuex Reference Helper for VSCode.
- Enable Ctrl/Cmd + Click navigation to Vuex definitions:
  - `state`
  - `getters`
  - `mutations`
  - `modules`
- Support navigation across `.vue`, `.js`, and `.ts` files.
- Handle path resolution using `tsconfig.json` / `jsconfig.json` aliases.
