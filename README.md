# このサイトについて

nozaqiのポートフォリオサイトです。
## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- MDX (remark + remark-html)
- Cloudflare Pages (静的エクスポート)

## デプロイ

GitHub Actions で `main` に push すると自動的に Cloudflare Pages にデプロイされる。

### GitHub Secrets

| Secret | 内容 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token (Edit Workers) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
