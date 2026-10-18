"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const script = fs.readFileSync(path.join(root, "content.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert.equal(manifest.manifest_version, 3);
assert(manifest.host_permissions.includes("https://github.com/*"));
assert(manifest.content_scripts.some((entry) =>
  entry.matches.includes("https://github.com/*") &&
  entry.js.includes("content.js") &&
  entry.css.includes("styles.css")
));
assert(!manifest.permissions || manifest.permissions.length === 0, "extension should not request extra permissions");
assert(script.includes("document.createTextNode"), "tokens must preserve source text as text nodes");
assert(script.includes("span.textContent = match[0]"), "source tokens must not be inserted as HTML");
assert(script.includes("MutationObserver"), "GitHub's dynamic navigation should be observed");
assert(styles.includes("#282a36") && styles.includes("#f8f8f2"), "Dracula background and foreground colors must exist");

// The route matcher must support both root-level and nested .2flow files.
const routeMatcher = /\/blob\/[^/]+\/.*\.2flow$/i;
assert(routeMatcher.test("/suissa/repo/blob/main/example.2flow"));
assert(routeMatcher.test("/suissa/repo/blob/main/flows/example.2flow"));
assert(!routeMatcher.test("/suissa/repo/blob/main/README.md"));

console.log("2flow Chrome extension smoke tests passed.");
