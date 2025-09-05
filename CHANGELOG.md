# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-09-05

### Added

- Additionally enabled Ctrl/Cmd + Click navigation to Vuex definitions:
  - `actions`

### Fixed

- Supports navigating states, getters, mutations and actions within a store file

## [1.0.1] - 2025-09-01

### Fixed

- Remove ast cache while a document is changed(prevent to reload vscode to update ast cache).
- Change `.vue` files to function normally even if it does not start with a script tag.

## [1.0.0] - 2025-08-31

### Added

- Initial release of Vuex Reference Helper for VSCode.
- Enabled Ctrl/Cmd + Click navigation to Vuex definitions:
  - `state`
  - `getters`
  - `mutations`
  - `modules`
- Supports navigation across `.vue`, `.js`, and `.ts` files.
- Handles path resolution using `tsconfig.json` / `jsconfig.json` aliases.
