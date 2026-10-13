"use strict";

const vscode = require("vscode");

function activate(context) {
  // The grammar contributions do the highlighting. Registering the language here
  // also gives untitled documents a predictable language id when selected manually.
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider({ language: "2flow" }, {
      provideDocumentSymbols(document) {
        const symbols = [];
        for (let line = 0; line < document.lineCount; line++) {
          const text = document.lineAt(line).text;
          const match = text.match(/^\s*(?:flow|execution)\s+([\w.$:-]+)/);
          if (match) {
            const range = new vscode.Range(line, 0, line, text.length);
            symbols.push(new vscode.DocumentSymbol(
              match[1],
              match[0].trim().startsWith("flow ") ? "Topological flow" : "Execution scope",
              match[0].trim().startsWith("flow ") ? vscode.SymbolKind.Struct : vscode.SymbolKind.Function,
              range,
              range
            ));
          }
        }
        return symbols;
      }
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
