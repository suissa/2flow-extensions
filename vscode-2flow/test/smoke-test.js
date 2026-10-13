"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const grammar = JSON.parse(fs.readFileSync(path.join(root, "syntaxes/2flow.tmLanguage.json"), "utf8"));
const markdownGrammar = JSON.parse(fs.readFileSync(path.join(root, "syntaxes/2flow-markdown.tmLanguage.json"), "utf8"));

assert.strictEqual(pkg.contributes.languages[0].id, "2flow");
assert(pkg.contributes.languages[0].extensions.includes(".2flow"));
assert.strictEqual(grammar.scopeName, "source.2flow");
assert.strictEqual(markdownGrammar.injectionSelector, "L:markup.fenced_code.block.markdown");
for (const op of [":--:", "!->", "->>", "->", "<-", "<<-"]) {
  assert(grammar.repository.operators.patterns.some((p) => p.match === op || new RegExp(p.match).test(op)), `missing operator ${op}`);
}
console.log("2flow VS Code extension smoke tests passed.");
