# 2flow — Dracula Syntax for VS Code

Syntax highlighting for the [2flow notation](https://github.com/suissa/2flow), using Dracula's palette. Works in standalone `.2flow` files and fenced Markdown blocks marked `2flow`.

## Features

- Highlights topological operators: `:--:`, `[...]`, `!->`, and human gates `[? ...]`.
- Highlights execution operators: `->`, `<-`, `->>`, and `<<-`.
- Distinguishes `flow` and `execution` scopes, `Ok<T>` / `Error<E>`, types, comments, strings, and identifiers.
- Provides document symbols for `flow` and `execution` declarations.
- Includes a dedicated **2flow Dracula** color theme with the Dracula background, editor colors, and syntax palette.

## Install locally

1. Open this repository folder in VS Code.
2. Run **Developer: Install Extension from Location...** if supported by your VS Code version, or package it:
   ```sh
   cd vscode-2flow
   npm test
   npm install --global @vscode/vsce
   vsce package
   code --install-extension 2flow-dracula-0.1.0.vsix
   ```

For development, open the `vscode-2flow` folder in VS Code and press F5 to launch an Extension Development Host.

## Markdown example

```2flow
ReceivePurchase
  :--: [RegisterFinancialEntry, RegisterAccountingEntry]
  :--: ValidatePurchase !-> QuarantinePurchase

execution StockAgent.DecreaseStock
  -> Ok<SaleResolved>
  ->> DecreaseStock
  <<- DecreaseStock
  <- Ok<StockExitCommitted>
  <- Error<StockExitError>
```

## Notes

This extension provides lexical highlighting, not a parser or validator. Compiler/runtime validation remains the responsibility of the 2flow toolchain.

## License

MIT
