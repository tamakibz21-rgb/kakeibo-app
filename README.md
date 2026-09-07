# レシート読み込み家庭簿

レシート画像をアップロードすると、Claude API(claude-haiku)が商品名・金額・日付を自動で読み取り、カテゴリ別に分類・集計する家計簿Webアプリです。

## 構成

- `frontend/` : React (Vite) 製のフロントエンド
- `backend/` : Node.js (Express) 製のバックエンド。Claude APIの呼び出しはここでのみ行う(APIキーはブラウザに渡さない)

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm run install:all
```

### 2. Claude APIキーの設定

```bash
cp backend/.env.example backend/.env
```

`backend/.env` を開き、`ANTHROPIC_API_KEY` に [Anthropic Console](https://console.anthropic.com/) で発行したAPIキーを設定してください。
`backend/.env` は `.gitignore` に含まれているため、GitHubにはコミットされません。

### 3. 開発サーバーの起動

```bash
npm run dev
```

- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:3001

フロントエンドの `/api` へのリクエストは Vite の開発プロキシ経由でバックエンドに転送されます。

## 機能

- レシート画像アップロード → Claude APIによる自動読み取り(店舗名・購入日・商品名・金額・カテゴリ)
- 読み取り結果の一覧表示
- カテゴリ別(食費・外食・日用品・交通費・娯楽・医療・その他)の自動分類・集計
- Chart.js によるカテゴリ別円グラフ・月別棒グラフ
- 登録データはブラウザのローカルストレージに保存され、リロードしても消えません
