# ルーレットアプリ

Vite + React + TypeScript で作成したフロントエンドのみのルーレットアプリです。
ボタンを押すと回転し、慣性で減速して停止します。

## 開発環境

- Node.js
- pnpm

## セットアップ

```bash
pnpm install
```

## 開発サーバー

```bash
pnpm run dev
```

## ビルド

```bash
pnpm run build
```

## フォーマット / リント

```bash
pnpm run format
pnpm run lint
pnpm run check
```

## カスタマイズ

`src/App.tsx` の `options` 配列を編集すると、ルーレットの項目を変更できます。
