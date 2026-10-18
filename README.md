# 2flow Extensions

Dracula-inspired syntax highlighting for [2flow](https://github.com/suissa/2flow), delivered as two independent extensions.

## Extensions

### 1. VS Code — `vscode-2flow/`

- Syntax highlighting for standalone `.2flow` files, with an included **2flow Dracula** editor color theme.
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

## Build and validation

GitHub Actions validates JSON, JavaScript syntax, VS Code grammar metadata, and Chrome extension guards on pushes and pull requests. Successful runs publish installable artifacts for 14 days:

- `*.vsix` — install in VS Code using **Extensions: Install from VSIX...**.
- `2flow-dracula-chrome.zip` — extract it, then load the extracted `chrome-2flow` files as an unpacked extension. The archive contains the manifest, content script, stylesheet, and instructions.

Find artifacts under the **Actions → Validate extensions → latest successful run → Artifacts** section.

These are lexical highlighters, not a 2flow parser or validator. Automated tests do not replace a manual visual check in a VS Code Extension Development Host and Chrome on GitHub, whose DOM can change.

## License

MIT
