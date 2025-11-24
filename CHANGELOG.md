# Changelog

All notable changes to this project will be documented in this file.

## [2.2.6] - 2025.11.24

- Re-enable the navigation of actions.

## [2.2.4] - 2025.11.19

- Remove unnecessary results(files) in build.

## [2.2.3] - 2025.11.18

- Improve stability and performance.
  - Strengthen error handling
  - Prevent memory leaks

## [2.2.2] - 2025.10.08

### Added

- Automatically rebuild the Vuex symbol table when store module files are changed.
  - Previously, the symbol table was only rebuilt when files importing `createStore()` files are changed

## [2.2.1] - 2025.10.08

### Added

- Add a demo video of 2.2.0 feature.

## [2.2.0] - 2025.10.08

### Added

- Add VSCode IntelliSense completion support.
  - `store.state.` shows all states
  - `store.getters.` shows all getters without namespace
  - `store.getters["` or `store.getters['` shows all getters
  - `store.commit("` or `store.commit('` shows all mutations
  - `store.dispatch("` or `store.dispatch('` shows all actions

### Fixed

- Fix incorrect navigation for nested state properties.
  - Clicking on the second or third `count` in `store.state.count.count.count` would incorrectly navigate to the definition of the first `count`

## [2.1.0] - 2025.10.04

### Added

- Enable a function to rebuild the vuex symbol table when the vuex usage files are changed.

### Fixed

- Change a path resolution to check if the file actually exists.
- Change ast cache key to identify files easily.
  - `vscode.Uri.toString()` -> `vscode.Uri.fsPath`

## [2.0.1] - 2025.10.02

### Fixed

- Support the optional chaining and the non-null assertion operation.
  - ex. `store.state.module?.state` or `store?.state?.object1!.key`

## [2.0.0] - 2025.10.01

### Changed

- Change supported VS code engine version.
  - `^1.102.0` -> `^1.99.0`

### Fixed

- Change the misleading of the `getters` to the definition of `state`, when the name of the `state` is same with the name of the `getters`.

## [1.1.0] - 2025.09.05

### Added

- Additionally enabled Ctrl/Cmd + Click navigation to Vuex definitions:
  - `actions`

### Fixed

- Support navigating states, getters, mutations and actions within a store file.

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
