"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "content.js"), "utf8");

class FakeNode {
  constructor(tagName = "#text", text = "") {
    this.tagName = tagName;
    this.children = [];
    this.parent = null;
    this.className = "";
    this.dataset = {};
    this.attributes = {};
    this._text = text;
    this.classList = {
      add: (...names) => {
        const current = new Set(this.className.split(/\s+/).filter(Boolean));
        names.forEach((name) => current.add(name));
        this.className = [...current].join(" ");
      },
      contains: (name) => this.className.split(/\s+/).includes(name)
    };
  }

  append(...nodes) {
    for (const node of nodes) {
      if (node.tagName === "#fragment") {
        this.append(...node.children.slice());
        node.children = [];
      } else {
        node.parent = this;
        this.children.push(node);
      }
    }
  }

  replaceChildren(...nodes) {
    this.children = [];
    this.append(...nodes);
  }

  get textContent() {
    if (this.tagName === "#text") return this._text;
    return this.children.map((child) => child.textContent).join("");
  }

  set textContent(value) {
    this.children = [];
    this._text = "";
    if (value !== "") this.append(new FakeNode("#text", String(value)));
  }

  get innerText() {
    return this.textContent;
  }

  closest(selector) {
    if (selector.includes("highlight-source-2flow") && this.isTwoflowWrapper) return this;
    return null;
  }

  querySelector(selector) {
    if (selector === "code") return this.code || null;
    return null;
  }

  querySelectorAll(selector) {
    if (selector === "pre") return this.pres || [];
    if (selector.includes("pre")) return this.routePres || [];
    return [];
  }
}

function makePre(text, { twoflowFence = false } = {}) {
  const pre = new FakeNode("pre");
  pre.isTwoflowWrapper = twoflowFence;
  const code = new FakeNode("code");
  code.textContent = text;
  code.className = twoflowFence ? "language-2flow" : "";
  pre.code = code;
  pre.children = [code];
  code.parent = pre;
  pre.previousElementSibling = null;
  return pre;
}

function runContentScript({ pathname, pre, routePre = pre }) {
  const documentElement = new FakeNode("html");
  const head = new FakeNode("head");
  const document = {
    head,
    documentElement,
    createDocumentFragment: () => new FakeNode("#fragment"),
    createTextNode: (value) => new FakeNode("#text", String(value)),
    createElement: (tag) => new FakeNode(tag),
    getElementById: (id) => head.children.find((node) => node.id === id) || null,
    querySelectorAll: (selector) => {
      if (selector === "pre") return [pre];
      if (selector.includes("pre")) return [routePre];
      return [];
    },
    addEventListener: () => {}
  };
  const context = {
    document,
    location: { pathname },
    MutationObserver: class { observe() {} },
    console
  };
  vm.runInNewContext(source, context, { filename: "content.js" });
  return { pre, code: pre.code, head };
}

{
  const original = 'flow delivery\nclassify -> validate\nname "<img src=x>"\n# comment';
  const pre = makePre(original, { twoflowFence: true });
  const result = runContentScript({ pathname: "/suissa/repo/blob/main/README.md", pre });
  assert.equal(result.pre.dataset.twoflowDracula, "1", "language-2flow fence should be decorated");
  assert(result.code.children.some((node) => node.className === "twoflow-line"), "each source line should be wrapped");
  assert.equal(result.code.textContent, original + "\n", "rendered text should preserve source content");
  assert(!result.code.children.some((node) => node.tagName === "img"), "source text must never become HTML");
  assert(result.code.children[0].children.some((node) => node.className === "twoflow-keyword"), "flow keyword should be tokenized");
  assert(result.code.children[1].children.some((node) => node.className === "twoflow-operator"), "operator should be tokenized");
}

{
  const pre = makePre("flow root_file\nstart -> finish");
  const result = runContentScript({ pathname: "/suissa/repo/blob/main/example.2flow", pre });
  assert.equal(result.pre.dataset.twoflowDracula, "1", "root-level .2flow blob should be decorated");
}

{
  const pre = makePre("flow nested_file\nstart -> finish");
  const result = runContentScript({ pathname: "/suissa/repo/blob/main/flows/example.2flow", pre });
  assert.equal(result.pre.dataset.twoflowDracula, "1", "nested .2flow blob should be decorated");
}

{
  const pre = makePre("ordinary markdown content");
  const result = runContentScript({ pathname: "/suissa/repo/blob/main/README.md", pre });
  assert.equal(result.pre.dataset.twoflowDracula, undefined, "ordinary Markdown pre blocks must not be force-highlighted");
}

console.log("2flow Chrome DOM regression tests passed.");
