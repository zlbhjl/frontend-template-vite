# README.md

## プロジェクト概要

このリポジトリは、Vite + React + TypeScript を使用したフロントエンドテンプレートです。

## 環境構築

### 1. スタンドアロン版 pnpm のインストール

[スタンドアロン版pnpmをインストール](https://pnpm.io/ja/installation#%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%89%E3%82%A2%E3%83%AD%E3%83%B3%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B)

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 2. 依存関係のインストール＆フック有効化

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
.github/                
src/                    
  ├ components/         
  ├ pages/              
  ├ routes/             
  ├ services/           
  ├ stores/             
  ├ styles/             
  ├ App.tsx             
  └ main.tsx            
tests/                  
.env.example            
index.html              
package.json            
tsconfig.json           
vite.config.ts          
vitest.config.ts        
```