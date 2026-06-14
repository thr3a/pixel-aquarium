---
name: git-commit-split
description: gitでstage済みの差分だけを対象に、未stageの変更へ触れず、意味のある単位に分割して複数コミットするためのスキル。「分割コミットして」と言われたら発動する。
---

# 実行手順

1. `git diff --cached --stat` と `git diff --cached` で全体像と差分内容をつかむ。
2. 差分を読み、意味のあるコミット単位に分割する計画を立てる。同一ファイル内に複数の目的の変更が混在している場合も、hunk単位で分ける。
3. 現在stageされている差分を一旦すべて `git reset HEAD` でunstageする（working treeの変更はそのまま残る）。
4. コミット単位ごとに以下を繰り返す:
   a. 対象ファイルが丸ごと1つのコミットに入る場合は `git add <path>` でstageする。
   b. 同一ファイルの一部だけをstageしたい場合は `git add -p <path>` を使う。`git add -p` は対話的コマンドなので直接実行できない。代わりに以下の手順で部分stageを行う:
      - `git diff -- <path>` で現在のunstaged diffを確認し、stageしたい行範囲を特定する。
      - Editツールで一時的にファイルを「stageしたい状態」に書き換え、`git add <path>` でstageする。
      - stageした直後に、Editツールでファイルを元の内容（全変更が入った状態）に復元する。
   c. `git diff --cached --stat` でstage内容が意図通りか確認してからコミットする。
5. 最後に `git status --short --branch` を確認し、stageが空で未stage変更が残っていないことを確認する。

# ルール

- 開始時点で `git add` されている差分のみが対象。 **未stageの変更は対象外なので触らない**
- 差分を次の観点で意味のあるコミット単位に分けること。ファイル単位ではなく変更の目的単位で分ける。
  - 目的が同じ変更
  - 同じ開発フローに属する変更
  - 同時にレビューされるべき変更
- 同一ファイルに複数の目的の変更がある場合、hunk（変更ブロック）単位で別コミットに分割する
- **pushは行わない**
- gitコミットメッセージのprefixは以下
  - add:
  - fix:
  - clean:
  - docs:
  - update:
