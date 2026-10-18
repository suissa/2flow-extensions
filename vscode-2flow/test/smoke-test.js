"use strict";

const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const repoRoot = path.resolve(root, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const grammar = JSON.parse(fs.readFileSync(path.join(root, "syntaxes/2flow.tmLanguage.json"), "utf8"));
const markdownGrammar = JSON.parse(fs.readFileSync(path.join(root, "syntaxes/2flow-markdown.tmLanguage.json"), "utf8"));
const theme = JSON.parse(fs.readFileSync(path.join(root, "themes/2flow-dracula-color-theme.json"), "utf8"));
const standaloneFixture = fs.readFileSync(path.join(repoRoot, "fixtures/visual-regression.2flow"), "utf8");
const markdownFixture = fs.readFileSync(path.join(repoRoot, "fixtures/visual-regression.md"), "utf8");

assert.strictEqual(pkg.contributes.languages[0].id, "2flow");
assert(pkg.contributes.languages[0].extensions.includes(".2flow"));
assert.strictEqual(grammar.scopeName, "source.2flow");
assert.strictEqual(markdownGrammar.injectionSelector, "L:text.html.markdown");
assert(markdownGrammar.patterns.some((pattern) => pattern.begin.includes("2flow")));
assert(pkg.contributes.grammars.some((entry) =>
  entry.scopeName === markdownGrammar.scopeName &&
  entry.injectTo.includes("text.html.markdown") &&
  entry.path === "./syntaxes/2flow-markdown.tmLanguage.json"
));

// Operator patterns must recognize the complete operator, not just its first character.
for (const op of [":--:", "!->", "->>", "->", "<-", "<<-"]) {
  assert(grammar.repository.operators.patterns.some((pattern) =>
    new RegExp(pattern.match).test(op) && pattern.name.startsWith("keyword.operator.")
  ), `missing operator pattern ${op}`);
}

// Ensure the declared theme provides the primary lexical color families.
const themeScopes = theme.tokenColors.flatMap((rule) =>
  Array.isArray(rule.scope) ? rule.scope : [rule.scope]
);
for (const scope of [
  "comment", "string", "constant.numeric", "keyword.operator.ingress.1.2flow",
  "keyword.control.flow.2flow", "support.type.result.2flow",
  "entity.name.namespace.2flow", "entity.name.function.2flow"
]) {
  assert(themeScopes.includes(scope), `theme has no token color rule for ${scope}`);
}
assert.equal(theme.colors["editor.background"], "#282a36");
assert.equal(theme.colors["editor.foreground"], "#f8f8f2");

// The visual fixture must cover the main token categories and the two supported fence styles.
for (const token of [":--:", "!->", "->>", "->", "<-", "<<-", "[?", "Ok<Delivery>", "Error<ValidationError>", "true", "3", '"quoted string', "# line comment"]) {
  assert(standaloneFixture.includes(token) || markdownFixture.includes(token), `fixture is missing ${token}`);
}
assert(markdownFixture.includes("```2flow"), "fixture must include a backtick 2flow fence");
assert(markdownFixture.includes("~~~2flow"), "fixture must include a tilde 2flow fence");

console.log("2flow VS Code extension smoke tests passed.");
