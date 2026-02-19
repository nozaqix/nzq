import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import YouTube from '@/components/mdx/YouTube';
import PurchaseLinks from '@/components/mdx/PurchaseLinks';
import SkeletonImage from '@/components/SkeletonImage';
import BackgroundImagePreloader from '@/components/BackgroundImagePreloader';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `https://nozaqi.work/works/${slug}/`,
    },
  };
}

// HTMLコンテンツから画像URLを抽出する関数
function extractImageUrls(html: string): string[] {
  const imageUrls: string[] = [];
  const matches = html.matchAll(/\[IMAGE_PLACEHOLDER:([^\]]+)\]/g);
  for (const match of matches) {
    const content = match[1];
    const lastColonIndex = content.lastIndexOf(':');
    const src = lastColonIndex !== -1 ? content.substring(0, lastColonIndex) : content;
    if (src && !imageUrls.includes(src)) {
      imageUrls.push(src);
    }
  }
  return imageUrls;
}

// HTMLコンテンツを処理し、プレースホルダーをコンポーネントに置き換える関数
function processHtmlContent(html: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let processedHtml = html;
  let componentIndex = 0;
  let imageIndex = 0;

  // PurchaseLinksプレースホルダーを処理
  processedHtml = processedHtml.replace(
    /\[PURCHASE_LINKS_PLACEHOLDER:([^\]]+)\]/g,
    (match, encoded) => {
      try {
        const linksJson = Buffer.from(encoded, 'base64').toString('utf8');
        const links = JSON.parse(linksJson);
        if (!Array.isArray(links)) {
          console.error('PurchaseLinks: links is not an array', links);
          return match;
        }
        const placeholder = `__COMPONENT_${componentIndex}__`;
        parts.push(<PurchaseLinks key={placeholder} links={links} />);
        componentIndex++;
        return placeholder;
      } catch (error) {
        console.error('Error parsing PurchaseLinks:', error, 'Encoded:', encoded);
        return match;
      }
    }
  );

  // YouTubeプレースホルダーを処理
  processedHtml = processedHtml.replace(
    /\[YOUTUBE_PLACEHOLDER:([^\]]+)\]/g,
    (match, id) => {
      const placeholder = `__COMPONENT_${componentIndex}__`;
      parts.push(<YouTube key={placeholder} id={id} />);
      componentIndex++;
      return placeholder;
    }
  );

  // 画像プレースホルダーを処理（最後の:で分割して、srcとaltを抽出）
  processedHtml = processedHtml.replace(
    /\[IMAGE_PLACEHOLDER:([^\]]+)\]/g,
    (match, content) => {
      // 最後の:で分割
      const lastColonIndex = content.lastIndexOf(':');
      const src = lastColonIndex !== -1 ? content.substring(0, lastColonIndex) : content;
      const alt = lastColonIndex !== -1 ? content.substring(lastColonIndex + 1) : '';
      const placeholder = `__COMPONENT_${componentIndex}__`;
      const currentImageIndex = imageIndex++;
      const isPriority = currentImageIndex === 0;
      parts.push(
        <div key={placeholder} className="my-6">
          <SkeletonImage
            src={src}
            alt={alt || ''}
            width={800}
            height={600}
            className="w-full h-auto"
            unoptimized
            priority={isPriority}
          />
        </div>
      );
      componentIndex++;
      return placeholder;
    }
  );

  // 見出し要素にスタイルを直接適用
  processedHtml = processedHtml.replace(
    /<h([1-6])([^>]*)>/g,
    (match, level, attrs) => {
      const marginTop = level === '2' ? '2rem' : level === '3' ? '1.5rem' : '1rem';
      const marginBottom = level === '2' ? '1rem' : level === '3' ? '0.75rem' : '0.5rem';
      return `<h${level}${attrs} style="font-size: 14px !important; color: #B8B9BA !important; font-weight: 700 !important; line-height: 1.5 !important; letter-spacing: 0.6px !important; font-family: Inter, sans-serif !important; margin-top: ${marginTop} !important; margin-bottom: ${marginBottom} !important; display: block;">`;
    }
  );

  // HTMLを分割してコンポーネントと結合
  const segments = processedHtml.split(/(__COMPONENT_\d+__)/);
  const finalParts: React.ReactNode[] = [];
  let partCounter = 0;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment.match(/^__COMPONENT_\d+__$/)) {
      const index = parseInt(segment.match(/\d+/)![0], 10);
      finalParts.push(
        <React.Fragment key={`component-${partCounter++}`}>
          {parts[index]}
        </React.Fragment>
      );
    } else if (segment.trim()) {
      finalParts.push(
        <div
          key={`html-${partCounter++}`}
          dangerouslySetInnerHTML={{ __html: segment }}
          className="prose prose-invert max-w-none text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter"
        />
      );
    }
  }

  return <>{finalParts}</>;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.htmlContent) {
    notFound();
  }

  // 記事内の画像URLを抽出
  const imageUrls = extractImageUrls(post.htmlContent);
  // サムネイルも追加
  if (post.frontmatter.thumbnail && !imageUrls.includes(post.frontmatter.thumbnail)) {
    imageUrls.unshift(post.frontmatter.thumbnail);
  }

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col page-transition">
      {/* バックグラウンドで画像をプリロード（ローディング画面は表示しない） */}
      <BackgroundImagePreloader imageUrls={imageUrls} />

      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="flex flex-col items-start gap-[240px] w-full p-6 md:p-10 flex-1">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 w-full min-w-0">
          {/* Left Column - Breadcrumb */}
          <div className="w-full lg:w-[400px] flex-shrink-0 min-w-0">
            <div>
              <Link href="/" className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter hover:opacity-70 transition-opacity">
                Home
              </Link>
              {post.frontmatter.category === 'Release' && (
                <>
                  <span className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter mx-2">
                    {'>'}
                  </span>
                  <Link href="/works/" className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter hover:opacity-70 transition-opacity">
                    Works
                  </Link>
                </>
              )}
              <span className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter mx-2">
                {'>'}
              </span>
              <span className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter">
                {post.frontmatter.title}
              </span>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 w-full min-w-0 max-w-[1600px]">
            <div className="space-y-6">
              {/* Article Header */}
              <div className="space-y-1.5">
                <div className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter">
                  {formatDate(post.frontmatter.date)}
                </div>
                <div className="text-xs text-[#999999] font-normal leading-normal tracking-[0.6px] font-inter">
                  [{post.frontmatter.category}]
                </div>
                <h1 className="text-xl text-white font-bold leading-normal tracking-[2px] font-din-next">
                  {post.frontmatter.title}
                </h1>
              </div>

              {/* Article Content */}
              <div>
                {processHtmlContent(post.htmlContent)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

