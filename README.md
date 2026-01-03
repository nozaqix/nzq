# Portfolio Site

フリーランスのデザイナー兼コンポーザーのポートフォリオサイトです。

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- MDX (remark + remark-html)
- Cloudflare Pages (静的エクスポート)

## セットアップ

### 1. パッケージのインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 3. ビルド

```bash
npm run build
```

ビルド結果は `out/` ディレクトリに出力されます。このディレクトリをCloudflare Pagesにデプロイできます。

## コンテンツの追加

記事は `src/content/works/*.mdx` に配置してください。

### Frontmatter形式

```yaml
---
title: 記事タイトル
date: 2025-11-21
category: Release
slug: article-slug
thumbnail: /images/thumbnail.webp
---
```

### カテゴリ

- Release
- Diary
- Dev
- Event

### MDXコンポーネント

#### YouTube埋め込み

```mdx
<YouTube id="動画ID" />
```

## Cloudflare Pagesへのデプロイ

1. Cloudflare Pagesのダッシュボードで新しいプロジェクトを作成
2. ビルドコマンド: `npm run build`
3. ビルド出力ディレクトリ: `out`
4. Node.jsバージョン: 18以上を推奨

