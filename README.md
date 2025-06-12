# README.md

## プロジェクト概要

このリポジトリは、Vite + React + TypeScript を使用したフロントエンドテンプレートです。

## 環境構築

### 1. スタンドアロン版 pnpm のインストール

[スタンドアロン版pnpmをインストール](https://pnpm.io/ja/installation#%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%89%E3%82%A2%E3%83%AD%E3%83%B3%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B)

※WindowsではWindows Defender関係で問題が起きる可能性があるため、WSLなどへのインストールを推奨します

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 2. 依存関係のインストール＆フック有効化

プロジェクトルートで以下を実行

```bash
pnpm install
```

## 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` にアクセスすると、アプリケーションが表示されます。

## スクリプト一覧

* `pnpm dev`：開発サーバーを起動
* `pnpm build`：ビルド (TypeScript の型チェックと Vite ビルド)
* `pnpm lint`：コードフォーマットとリンティング (Biome を使用)
* `pnpm preview`：ビルド結果のプレビュー
* `pnpm prepare`：Git フックのセットアップ (Lefthook)

## ディレクトリ構成

```
.github/                  # GitHub Actions の設定
src/                      # ソースコードディレクトリ
  ├ components/           # 再利用可能なコンポーネント
  │  ├ Layout.tsx         # 共通レイアウト（ヘッダー、ナビゲーション）
  │  ├ lib/               # コンポーネント用ユーティリティ
  │  │  └ utils.ts        # shadcn/ui用のユーティリティ関数
  │  └ ui/                # shadcn/uiコンポーネント
  │     ├ button.tsx      # ボタンコンポーネント
  │     ├ card.tsx        # カードコンポーネント
  │     ├ navigation-menu.tsx # ナビゲーションメニュー
  │     └ sheet.tsx       # モバイルメニュー用シート
  ├ lib/                  # 共通ユーティリティ
  │  └ utils.ts           # 汎用ユーティリティ関数
  ├ pages/                # ページコンポーネント
  │  ├ HomePage.tsx       # ホームページ
  │  ├ PingPage.tsx       # APIヘルスチェックページ
  │  └ UsersPage.tsx      # ユーザー一覧ページ
  ├ routes/               # ルーティング設定
  │  └ index.tsx          # ルート定義とマッピング
  ├ services/             # API通信レイヤー
  │  ├ api.ts             # Axiosインスタンス設定
  │  ├ pingService.ts     # Ping API関連の処理
  │  └ userService.ts     # ユーザーAPI関連の処理
  ├ stores/               # 状態管理（Zustand）
  │  ├ pingStore.ts       # Ping状態の管理
  │  └ userStore.ts       # ユーザー状態の管理
  ├ styles/               # スタイルシート
  │  └ global.css         # グローバルCSS（Tailwind設定含む）
  ├ App.tsx               # アプリケーションのルートコンポーネント
  ├ main.tsx              # エントリーポイント
  └ vite-env.d.ts         # Vite環境の型定義
tests/                    # テスト関連
  └ setup.ts              # Vitestのセットアップ
.env.example              # 環境変数のサンプル
index.html                # HTMLテンプレート
package.json              # 依存関係とスクリプト
tsconfig.json             # TypeScript設定
vite.config.ts            # Vite設定
vitest.config.ts          # Vitest設定
tailwind.config.cjs       # Tailwind CSS設定
postcss.config.cjs        # PostCSS設定
components.json           # shadcn/ui設定
lefthook.toml            # Git hooks設定
```

## 各ディレクトリの詳細

### src/components/
UIコンポーネントを格納。shadcn/uiのコンポーネントとカスタムコンポーネントを含む。

### src/pages/
各ルートに対応するページコンポーネント。ビジネスロジックとUIを結合。

### src/services/
外部APIとの通信を担当。エンドポイントごとにファイルを分割。

### src/stores/
Zustandを使用したグローバル状態管理。機能ごとにストアを分割。

### src/routes/
React Routerのルーティング設定。すべてのルートを一元管理。

## 使用技術

[選定時のメモ](https://github.com/Tech-JAIST/frontend-template-vite/issues/1)
```
Typescript+React+Vite
(状態管理：Zustand)
ルーティング：React Router
HTTP クライアント：axios
Nodeのバージョン管理+パッケージマネージャ:スタンドアロン版pnpm

Linter・Formatter：Biome
Gitフック管理：Lefthook
UIフレームワーク：Tailwind CSS + shadcn/ui
```

## 環境変数

環境変数は `.env` ファイルで管理します。プロジェクトルートに `.env.example` を参考に `.env` ファイルを作成してください。

### 設定可能な環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| `VITE_API_URL` | APIのベースURL | `/api/v1` |

### 設定例

```bash
# .env
VITE_API_URL=https://api.example.com/v1
```

## 開発のヒント

### 新しいページを追加する場合

1. `src/pages/` に新しいページコンポーネントを作成
2. `src/routes/index.tsx` にルートを追加
3. `src/components/Layout.tsx` の `links` 配列にナビゲーションリンクを追加

### 新しいAPIサービスを追加する場合

1. `src/services/` に新しいサービスファイルを作成
2. `src/services/api.ts` のAxiosインスタンスを使用してAPIを呼び出す
3. 必要に応じて `src/stores/` に対応するストアを作成

### コンポーネントの追加

- UIコンポーネントは `src/components/ui/` に配置
- ページ固有のコンポーネントは各ページファイル内に定義するか、`src/components/` に配置