"use strict";

(() => {
  const STYLE_ID = "twoflow-dracula-style";
  const TOKEN_RE = /(#[^\n]*|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|:--:|!->|<<-|->>|->|<-|\[\?|\]|\[|\]|\b(?:flow|execution)\b|\b(?:Ok|Error)(?=\s*<)|\b(?:true|false|null|none)\b|\b\d+(?:\.\d+)?\b|\b(?:bool|u8|u16|u32|u64|i8|i16|i32|i64|f32|f64|string|void)\b|\b[A-Za-z_][\w-]*(?:\.[A-Za-z_][\w-]*)+\b)/g;
  const OPERATORS = new Set([":--:", "!->", "<<-", "->>", "->", "<-", "[?", "]", "[", "]"]);
  const KEYWORDS = new Set(["flow", "execution"]);
  const TYPES = new Set(["bool", "u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "f32", "f64", "string", "void"]);
  const CONSTANTS = new Set(["true", "false", "null", "none"]);

  function tokenClass(token) {
    if (token.startsWith("#") || token.startsWith("//")) return "twoflow-comment";
    if (token.startsWith('"') || token.startsWith("'")) return "twoflow-string";
    if (OPERATORS.has(token)) return "twoflow-operator";
    if (KEYWORDS.has(token)) return "twoflow-keyword";
    if (token === "Ok" || token === "Error") return "twoflow-result";
    if (TYPES.has(token)) return "twoflow-type";
    if (CONSTANTS.has(token)) return "twoflow-constant";
    if (/^\d/.test(token)) return "twoflow-number";
    if (token.includes(".")) return "twoflow-namespace";
    return "twoflow-identifier";
  }

  function highlightLine(line) {
    const fragment = document.createDocumentFragment();
    let last = 0;
    TOKEN_RE.lastIndex = 0;
    let match;
    while ((match = TOKEN_RE.exec(line)) !== null) {
      if (match.index > last) fragment.append(document.createTextNode(line.slice(last, match.index)));
      const span = document.createElement("span");
      span.className = tokenClass(match[0]);
      span.textContent = match[0];
      fragment.append(span);
      last = match.index + match[0].length;
      if (match[0].length === 0) TOKEN_RE.lastIndex++;
    }
    if (last < line.length) fragment.append(document.createTextNode(line.slice(last)));
    return fragment;
  }

  function isTwoflowFence(pre) {
    const wrapper = pre.closest(".highlight, .highlight-source-2flow, [class*='language-2flow']");
    if (wrapper) return true;
    const code = pre.querySelector("code");
    if (code && /(?:^|\s)(?:language-2flow|highlight-source-2flow)(?:\s|$)/i.test(code.className)) return true;
    const previous = pre.previousElementSibling;
    return !!(previous && /2flow/i.test(previous.textContent || ""));
  }

  function decoratePre(pre, force = false) {
    if (!pre || pre.dataset.twoflowDracula === "1") return;
    if (!force && !isTwoflowFence(pre)) return;
    const code = pre.querySelector("code") || pre;
    const source = code.innerText.replace(/\n$/, "");
    if (!source.trim()) return;
    const lines = source.split("\n");
    const output = document.createDocumentFragment();
    for (const line of lines) {
      const row = document.createElement("span");
      row.className = "twoflow-line";
      row.append(highlightLine(line));
      output.append(row, document.createTextNode("\n"));
    }
    code.replaceChildren(output);
    pre.classList.add("twoflow-dracula");
    code.classList.add("twoflow-code");
    pre.dataset.twoflowDracula = "1";
  }

  function apply() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = "/* marker; visual rules live in styles.css */";
      document.head.append(style);
    }

    document.querySelectorAll("pre").forEach((pre) => decoratePre(pre));

    // GitHub's rendered blob view for .2flow files has no language class.
    if (/\/blob\/[^/]+\/[^/]+\/.*\.2flow$/i.test(location.pathname)) {
      document.querySelectorAll(".react-code-view pre, table.highlight pre, .blob-wrapper pre, #repo-content-pjax-container pre")
        .forEach((pre) => decoratePre(pre, true));
    }
  }

  apply();
  const observer = new MutationObserver(() => apply());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("turbo:load", apply);
  document.addEventListener("pjax:end", apply);
})();
