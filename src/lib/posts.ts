import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

// Cloudflare Pages環境での互換性のため、ビルド時のみfsを使用
const postsDirectory = typeof process !== 'undefined' && process.cwd 
  ? path.join(process.cwd(), 'src/content/works')
  : 'src/content/works';

export interface PostFrontmatter {
  title: string;
  date: string;
  category: string;
  thumbnail?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  htmlContent?: string;
}

async function processMarkdown(content: string): Promise<string> {
  // カスタムコンポーネントを一時的にプレースホルダーに置き換え
  // PurchaseLinksコンポーネントを処理（複数のリンクをJSON形式で受け取る）
  // より堅牢な正規表現：引用符で囲まれた文字列全体を取得
  let processedContent = content.replace(
    /<PurchaseLinks\s+links=(['"])([\s\S]*?)\1\s*\/>/g,
    (match, quote, linksJson) => {
      try {
        // JSON文字列をBase64エンコードしてプレースホルダーに埋め込む
        const encoded = Buffer.from(linksJson, 'utf8').toString('base64');
        return `[PURCHASE_LINKS_PLACEHOLDER:${encoded}]`;
      } catch (error) {
        console.error('Error processing PurchaseLinks:', error);
        return match;
      }
    }
  );

  // <br />タグをプレースホルダーに置き換え（remarkが削除するのを防ぐ）
  // 連続する<br />タグを1つのプレースホルダーにまとめる
  let brProcessed = processedContent;
  let brPlaceholderIndex = 0;
  brProcessed = brProcessed.replace(
    /(<br\s*\/?>\s*)+/gi,
    (match) => {
      const brCount = (match.match(/<br\s*\/?>/gi) || []).length;
      return `[BR_PLACEHOLDER:${brPlaceholderIndex++}:${brCount}]`;
    }
  );

  // YouTubeコンポーネントを処理
  const youtubePlaceholder = brProcessed.replace(
    /<YouTube id="([^"]+)"\s*\/>/g,
    (match, id) => `[YOUTUBE_PLACEHOLDER:${id}]`
  );

  // 空行2つのパターンを検出してプレースホルダーに置き換え（2段の改行用）
  // 空行2つ（改行文字が3つ連続 = 空行2つ）を検出
  // パターン: 任意の文字 + 改行 + 改行 + 改行 + 任意の文字
  const doubleLineBreakProcessed = youtubePlaceholder.replace(/([^\n\r])\n\n\n([^\n\r])/g, '$1\n[DOUBLE_LINE_BREAK]\n$2');

  // MDXをMarkdownとして処理
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { allowDangerousHtml: true })
    .process(doubleLineBreakProcessed);

  let html = String(processed);

  // BRプレースホルダーを<br />タグに戻す
  html = html.replace(
    /\[BR_PLACEHOLDER:\d+:(\d+)\]/g,
    (match, count) => {
      const brCount = parseInt(count, 10);
      return '<br />'.repeat(brCount);
    }
  );

  // DOUBLE_LINE_BREAKプレースホルダーを空のdiv要素に変換（2段の改行用）
  html = html.replace(
    /\[DOUBLE_LINE_BREAK\]/g,
    '<div style="height: 1.5rem; margin: 0; padding: 0;"></div>'
  );

  // HTMLに変換された後も、PurchaseLinksプレースホルダーが残っている可能性があるため、再度処理
  // （remarkがHTMLエンティティに変換した場合に対応）
  html = html.replace(
    /&lt;PurchaseLinks\s+links=(['"])([\s\S]*?)\1\s*\/&gt;/g,
    (match, quote, linksJson) => {
      try {
        const encoded = Buffer.from(linksJson, 'utf8').toString('base64');
        return `[PURCHASE_LINKS_PLACEHOLDER:${encoded}]`;
      } catch (error) {
        console.error('Error processing PurchaseLinks in HTML:', error);
        return match;
      }
    }
  );

  // 画像タグをプレースホルダーに置き換え（後でNext.js Imageコンポーネントに置き換える）
  // 属性の順序に関係なく、srcとaltを抽出（自己閉じタグにも対応）
  html = html.replace(
    /<img([^>]+?)(?:\s*\/)?>/g,
    (match, attrs) => {
      const srcMatch = attrs.match(/src=["']([^"']+)["']/);
      const altMatch = attrs.match(/alt=["']([^"']*)["']/);
      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      if (src) {
        return `[IMAGE_PLACEHOLDER:${src}:${alt}]`;
      }
      return match; // srcがない場合はそのまま返す
    }
  );

  return html;
}

export function getAllPosts(): Post[] {
  // ビルド時のみfsを使用（Cloudflare Pages互換性のため）
  if (typeof window !== 'undefined') {
    return [];
  }

  try {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        frontmatter: {
          title: data.title || '',
          date: data.date || '',
          category: data.category || '',
          thumbnail: data.thumbnail || undefined,
        },
        content,
      } as Post;
    });

  // 日付の降順でソート
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // ビルド時のみfsを使用（Cloudflare Pages互換性のため）
  if (typeof window !== 'undefined') {
    return null;
  }

  try {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // MDXをHTMLに変換
  const htmlContent = await processMarkdown(content);

  return {
    slug,
    frontmatter: {
      title: data.title || '',
      date: data.date || '',
      category: data.category || '',
      thumbnail: data.thumbnail || undefined,
    },
    content,
    htmlContent,
  } as Post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllSlugs(): string[] {
  // ビルド時のみfsを使用（Cloudflare Pages互換性のため）
  if (typeof window !== 'undefined') {
    return [];
  }

  try {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('Error reading slugs:', error);
    return [];
  }
}

