# Vuex Reference Helper

Vuex Reference Helper is a VSCode extension that enables **Ctrl/Cmd+Click navigation** to Vuex `state`, `getters`, `mutations` and `modules` across `.vue`, `.js`, and `.ts` files.  
It also supports **alias and path resolution**, making it easier to jump directly to Vuex definitions in large projects.

## Features

- Navigate to Vuex `state`, `getters`, and `mutations` definitions via **Ctrl/Cmd+Click**.
- Works seamlessly in `.vue`, `.js`, and `.ts` files.
- Supports **Vuex modules** and **namespaces** (recursively resolved).
- Respects project **alias paths** (e.g. `@/store`).
- Helps reduce context-switching between files while working with Vuex.

> 📷 Demo1 - Navigation

![demo1](https://github.com/mochang2/vuex-reference-helper/blob/master/videos/navigation_demo.gif)

> 📷 Demo2 - Suggestion

![demo2](https://github.com/mochang2/vuex-reference-helper/blob/master/videos/suggestion_demo.gif)

## Requirements

- **VS Code v1.99.0** or higher.
- Project must use Vuex (`createStore` entry file should be defined).
  - import as different name like `createStore as cs` is supported
- If you use path aliases (e.g. `@`), ensure they are configured in:
  - `jsconfig.json` or `tsconfig.json`
- For developing this extension, you should use v22.15.0 NodeJS or higher.

## Usage

1. Open a Vuex-based Vue project.
2. Hold Ctrl (Windows/Linux) or Cmd (Mac) and click:

- Vuex `state` references → jumps to definition.
- Vuex `getters` references → jumps to getter function.
- Vuex `mutations` references → jumps to mutation handler.

3. Works inside:

- `.vue` script or script setup blocks
- Regular `.js` and `.ts` files

## Supports

```json
"engines": {
  "vscode": "^1.99.0"
}
```

## License

[MIT](https://mit-license.org/)
