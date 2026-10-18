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

GitHub Actions validates JSON, JavaScript syntax, VS Code grammar metadata, theme scope coverage, and Chrome extension guards on pushes and pull requests. Successful runs publish installable artifacts for 14 days:

- `*.vsix` — install in VS Code using **Extensions: Install from VSIX...**.
- `2flow-dracula-chrome.zip` — extract it, then load the extracted files as an unpacked extension. The archive contains the manifest, content script, stylesheet, and instructions.

Find artifacts under the **Actions → Validate extensions → latest successful run → Artifacts** section.

## Visual regression fixtures

Open [`fixtures/visual-regression.2flow`](fixtures/visual-regression.2flow) and [`fixtures/visual-regression.md`](fixtures/visual-regression.md) to inspect representative tokens, operators, comments, strings, types, and both backtick and tilde fences.

Manual check:
1. Install the generated VS Code `.vsix`, select **2flow Dracula**, and open both fixtures. Check that standalone files and fenced blocks are highlighted, including the tilde fence.
2. Load the Chrome ZIP as an unpacked extension, then open the Markdown fixture on GitHub. Check the fenced block and a root-level and nested `.2flow` file in the repository.
3. Confirm text outside a fence keeps GitHub's normal styling and the original source remains selectable and unchanged.

Automated tests cover fixture contents and grammar/theme metadata, but they do not claim a real-browser visual pass. These are lexical highlighters, not a 2flow parser or validator; GitHub's DOM can change.

## License

MIT
