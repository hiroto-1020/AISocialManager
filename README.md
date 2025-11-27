# AI Social Manager

X (Twitter) と Instagram 向けの AI 自動投稿アプリケーションです。
OpenAI による文章生成と、Gemini による画像生成（オプション）をサポートしています。

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、必要な値を設定してください。

```bash
cp .env.example .env
```

- `DATABASE_URL`:
  - **Supabase (推奨)**: `postgresql://postgres:[パスワード]@[ホスト]:6543/postgres`
  - **ローカル開発 (SQLite)**: `file:./dev.db` (※ `prisma/schema.prisma` の provider を `sqlite` に変更する必要があります)
- `AUTH_SECRET`: ランダムな文字列 (例: `npx auth secret` で生成)
- `CREDENTIALS_ENCRYPTION_KEY`: 32文字のランダムな文字列 (APIキーの暗号化に使用)
- `OPENAI_API_KEY`: OpenAI の API キー
- `GEMINI_API_KEY`: (オプション) 画像生成に使用

### 3. データベースの準備

```bash
# テーブルの作成
npx prisma db push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

`http://localhost:3000` にアクセスしてください。

## 使い方

1. **アカウント作成**: サインアップ画面からユーザー登録を行います。
2. **プロジェクト作成**: ダッシュボードから新しいプロジェクトを作成します。
3. **X 連携設定**: プロジェクト設定画面で、X Developer Portal から取得した API Key / Secret 等を入力します。「接続テスト」で確認できます。
4. **カテゴリ設定**: 投稿のテーマやターゲット層を設定します。「トレンド参照」をONにすると、Xのトレンドを元に投稿を作成します。
5. **自動投稿**: 毎日 0:00 ～ 1:00 の間にスケジューラが走り、その日の投稿が予約されます。

## 開発者向け情報

- **Cron ジョブ**:
  - `/api/cron/daily`: 日次スケジューラ (1日1回実行)
  - `/api/cron/dispatch`: 投稿実行 (1分ごとに実行)
  - ローカル開発では、これらのエンドポイントを手動で叩くか、Vercel Cron 等の設定が必要です。
