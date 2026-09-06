#!/usr/bin/env python3
"""編集されたMarkdownドキュメントを検査し、問題があればClaudeに差し戻す。

PostToolUse(Edit|Write) フックから呼ばれ、標準入力でフック用JSONを受け取る。

検査するのは「機械で判定できること」だけ：
  1. 200行を超えていないか（ルートCLAUDE.mdの200行ルール）
  2. 文中に書かれたリポジトリ内パスが実在するか
     - バッククォートで囲まれたパス
     - コードブロック内のツリー図（├──/└──）
「この記述はもう不要」という価値判断は機械では出せないので扱わない。
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

MAX_LINES = 200

# 実在チェックから除外する書き方。プレースホルダやワイルドカードを含むもの
PLACEHOLDER_CHARS = set("<>*?〜~|${} 　")

# パスらしさの判定に使う拡張子。これ以外は「/」を含む場合だけパスとみなす
PATH_SUFFIXES = {
    ".md", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".scss", ".astro",
    ".json", ".jsonc", ".webp", ".png", ".svg", ".ico", ".yml", ".yaml",
}


def repo_root(start: Path) -> Path | None:
    for parent in [start, *start.parents]:
        if (parent / ".git").exists():
            return parent
    return None


def looks_like_path(text: str) -> bool:
    if not text or text.startswith((".", "#")) and "/" not in text:
        return False
    if "://" in text or text.startswith(("http", "@")):
        return False
    if PLACEHOLDER_CHARS & set(text):
        return False
    if "/" in text:
        return True
    return Path(text).suffix in PATH_SUFFIXES


def exists_somewhere(rel: str, bases: list[Path]) -> bool:
    return any((base / rel).exists() for base in bases)


def first_segment_is_real(rel: str, bases: list[Path]) -> bool:
    """先頭ディレクトリが実在する場合だけ「リポジトリ内のパス」と判断する。

    外部URLの断片や一般名詞をパスと誤認して警告を出さないための保険。
    """
    head = rel.split("/", 1)[0]
    return any((base / head).is_dir() for base in bases)


def backtick_paths(text: str) -> list[str]:
    found = []
    for raw in re.findall(r"`([^`\n]+)`", text):
        candidate = raw.strip().rstrip("、。,.")
        if looks_like_path(candidate):
            found.append(candidate)
    return found


def tree_paths(text: str) -> list[str]:
    """```で囲まれたツリー図から、インデントを辿って完全なパスを組み立てる。"""
    found: list[str] = []
    in_fence = False
    stack: list[tuple[int, str]] = []  # (マーカーの桁, ディレクトリ名)

    for line in text.splitlines():
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            stack = []
            continue
        if not in_fence:
            continue

        match = re.search(r"[├└]──\s*", line)
        if not match:
            continue

        column = match.start()
        name = line[match.end():]
        # 「← 説明」「（説明）」などの注釈を落とす
        name = re.split(r"[←（(\s]", name, maxsplit=1)[0].strip()
        if not name:
            continue

        while stack and stack[-1][0] >= column:
            stack.pop()

        full = "".join(parent for _, parent in stack) + name
        found.append(full)

        if name.endswith("/"):
            stack.append((column, name))

    return found


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0

    tool_input = payload.get("tool_input") or {}
    raw_path = (payload.get("tool_response") or {}).get("filePath") or tool_input.get("file_path")
    if not raw_path:
        return 0

    doc = Path(raw_path)
    if doc.suffix.lower() != ".md" or not doc.is_file():
        return 0

    root = repo_root(doc.resolve())
    if root is None:
        return 0

    text = doc.read_text(encoding="utf-8", errors="replace")
    bases = [doc.parent, root]
    problems: list[str] = []

    line_count = len(text.splitlines())
    if line_count > MAX_LINES:
        problems.append(
            f"{line_count}行あり、200行ルールを超えています。"
            "内容を別ファイルへ分割することをユーザーに提案してください。"
        )

    missing: list[str] = []
    for rel in dict.fromkeys(backtick_paths(text) + tree_paths(text)):
        clean = rel.rstrip("/")
        # 先頭の「/」はリポジトリルート起点の意味で書かれている（例: /rules/scss.md）
        targets = [root] if clean.startswith("/") else bases
        clean = clean.lstrip("/")
        if not clean or not first_segment_is_real(clean, targets):
            continue
        if not exists_somewhere(clean, targets):
            missing.append(rel)

    if missing:
        problems.append(
            "実在しないパスが書かれています（記述が古い可能性があります）: "
            + "、".join(missing)
        )

    if not problems:
        return 0

    print(f"[docs-check] {doc.relative_to(root)}", file=sys.stderr)
    for problem in problems:
        print(f"  - {problem}", file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
