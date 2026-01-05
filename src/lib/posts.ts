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
  slug: string;
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
  const youtubePlaceholder = content.replace(
    /<YouTube id="([^"]+)"\s*\/>/g,
    (match, id) => `[YOUTUBE_PLACEHOLDER:${id}]`
  );

  // MDXをMarkdownとして処理
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { allowDangerousHtml: true })
    .process(youtubePlaceholder);

  let html = String(processed);

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
    .filter((fileName) => fileName.endsWith('.mdx') && fileName !== 'contact.mdx')
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
          slug: data.slug || slug,
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
      slug: data.slug || slug,
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
    .filter((fileName) => fileName.endsWith('.mdx') && fileName !== 'contact.mdx')
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('Error reading slugs:', error);
    return [];
  }
}

