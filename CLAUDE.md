# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

kakeibo-app は、レシート画像をアップロードするとClaude APIが商品名・金額・日付を自動読み取りし、
カテゴリ別に分類・集計する家計簿Webアプリです。

- `frontend/` : React (Vite) 製のフロントエンド。Chart.jsでカテゴリ別円グラフ・月別棒グラフを表示。データはlocalStorageに保存。
- `backend/` : Node.js (Express) 製のバックエンド。Claude API (`claude-haiku-4-5-20251001`) の呼び出しはここでのみ行い、APIキーはブラウザに渡さない。
- Claude APIキーは `backend/.env` で管理し、`.gitignore` でコミット対象から除外している(`backend/.env.example` を参照)。

## Git運用ルール

- **コードに変更を加えるたびに、GitHubへコミット・プッシュすること。**
  作業を溜め込まず、意味のある変更のまとまりごとに commit → push まで完了させる。
- コミットメッセージは変更内容が分かるように簡潔に書く(日本語・英語どちらでも可)。
- コミット対象は関連ファイルのみを明示的に `git add` する(`git add -A` / `git add .` は避け、意図しないファイルの混入を防ぐ)。
- `.env` や認証情報など秘匿情報を含むファイルはコミットしない。
- force push (`git push --force`)、`git reset --hard`、履歴の書き換えなど破壊的な操作は行わない。ユーザーから明示的に指示された場合のみ実施する。
- pre-commit/pre-push フックは `--no-verify` でスキップしない。フックが失敗した場合は原因を修正してから再コミットする。
- リモートリポジトリ(GitHub)が未設定の場合は、先にユーザーに確認してから `git init` / リモート追加を行う。

## 開発の進め方

- 新機能追加時は、既存のコードスタイル・ディレクトリ構成に合わせる。
- 動作確認(テスト実行、ローカル起動など)を行ってからコミット・プッシュする。
- 大きな変更を行う前に、方針をユーザーと確認する。

## コマンド

- セットアップ: `npm run install:all`(ルートで実行、frontend/backend両方の依存関係をインストール)
- 開発サーバー起動: `npm run dev`(ルートで実行、frontend: http://localhost:5173 / backend: http://localhost:3001 を同時起動)
- フロントエンドのみ起動: `npm run dev --prefix frontend`
- バックエンドのみ起動: `npm run dev --prefix backend`
- フロントエンドビルド: `npm run build --prefix frontend`

## コーディング規約

- コメントは日本語で記載する。
