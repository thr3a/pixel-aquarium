---
name: git-commit-split
description: gitでstage済みの差分だけを対象に、未stageの変更へ触れず、意味のある単位に分割して複数コミットするためのスキル。「分割コミットして」と言われたら発動する。
---

# 実行手順

1. `git diff --cached --stat` で全体像をつかむ。
2. ファイル群ごとに `git diff --cached -- <paths...>` を見て、コミット候補を作る。
3. 候補ごとに、対象pathを明示して `git commit -m "<message>" -- <paths...>` を実行する。
4. コミットのたびに、残りのstage差分を確認する。
5. 最後に `git status --short --branch` を確認し、stageが空で未stage変更が残っていることを確認する。

# ルール

- `git add`されている差分のみが対象 **未stageの変更は対象外なので触らない**
- 差分を次の観点で意味のあるコミット単位に分けてること
  - 目的が同じ変更
  - 同じ開発フローに属する変更
  - 同時にレビューされるべき変更
- **pushは行わない**
- gitコミットメッセージのprefixは以下
  - add:
  - fix:
  - clean:
  - docs:
  - update:
