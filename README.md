# 2flow Extensions

Dracula-inspired syntax highlighting for [2flow](https://github.com/suissa/2flow), delivered as two independent extensions.

## Extensions

### 1. VS Code — `vscode-2flow/`

- Syntax highlighting for standalone `.2flow` files.
- Syntax highlighting for Markdown fences marked `2flow`.
- Highlights topological and execution operators, declarations, result types, strings, comments, and identifiers.
- Document symbols for `flow` and `execution` scopes.

[Installation and development instructions](vscode-2flow/README.md)

### 2. Chrome — `chrome-2flow/`

- Applies the same Dracula-inspired token colors to 2flow fences in GitHub-rendered Markdown.
- Highlights GitHub blob pages for files ending in `.2flow`.
- Runs locally on GitHub pages only; no network requests or data collection.

[Installation instructions](chrome-2flow/README.md)

## Palette

| Token | Color |
|---|---|
| Background | `#282a36` |
| Foreground | `#f8f8f2` |
| Operators and keywords | `#ff79c6` |
| Types and results | `#8be9fd` |
| Strings | `#f1fa8c` |
| Namespaces | `#50fa7b` |
| Constants and numbers | `#bd93f9` |
| Comments | `#6272a4` |

## Status

These are initial implementations of lexical highlighting, not a 2flow parser or validator. VS Code smoke tests are provided; the Chrome extension should be verified against GitHub’s current DOM because GitHub can change its rendering structure.

## License

MIT
