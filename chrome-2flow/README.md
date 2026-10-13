# 2flow Dracula Highlight — Chrome

A Manifest V3 extension that applies a Dracula-inspired syntax palette to 2flow code on GitHub. It supports rendered Markdown fences marked `2flow` and GitHub blob pages whose path ends in `.2flow`.

## Install in Chrome

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select the `chrome-2flow` folder.
5. Open or reload a GitHub page containing 2flow notation.

## Supported views

- Markdown: fenced blocks such as ```2flow in GitHub-rendered README files.
- Source files: `.2flow` files opened in GitHub's `/blob/` view.
- GitHub client-side navigation is handled through DOM observation and navigation events.

## Palette

| Token | Dracula color |
|---|---|
| Background | `#282a36` |
| Foreground | `#f8f8f2` |
| Operators / keywords | `#ff79c6` |
| Types / results | `#8be9fd` |
| Strings | `#f1fa8c` |
| Namespaces | `#50fa7b` |
| Constants / numbers | `#bd93f9` |
| Comments | `#6272a4` |

## Limitations

This is a client-side lexical highlighter, not a parser, compiler, or validator. GitHub may change its DOM structure; the extension includes multiple selectors but should be retested if GitHub changes its code viewer.

## Privacy and permissions

The extension only runs on `https://github.com/*`, does not call external services, and requests no data permissions. All highlighting happens locally in the page.

## License

MIT
