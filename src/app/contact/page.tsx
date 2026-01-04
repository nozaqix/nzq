import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPostBySlug } from '@/lib/posts';

async function getContactContent() {
  const contact = await getPostBySlug('contact');
  return contact;
}

// HTMLコンテンツを処理する関数（works/[slug]/page.tsxと同じ処理）
function processHtmlContent(html: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let processedHtml = html;
  let componentIndex = 0;

  // 画像プレースホルダーを処理
  processedHtml = processedHtml.replace(
    /\[IMAGE_PLACEHOLDER:([^:]+):([^\]]+)\]/g,
    (match, src, alt) => {
      const placeholder = `__COMPONENT_${componentIndex}__`;
      parts.push(
        <div key={placeholder} className="my-6">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto rounded-lg"
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
      return `<h${level}${attrs} style="font-size: 14px !important; color: #ffffff !important; font-weight: 700 !important; line-height: 1.5 !important; letter-spacing: 0.6px !important; font-family: Inter, sans-serif !important; margin-top: ${marginTop} !important; margin-bottom: ${marginBottom} !important; display: block;">`;
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
          className="prose prose-invert max-w-none text-sm text-white font-normal leading-normal tracking-[0.6px] font-inter"
        />
      );
    }
  }

  return <>{finalParts}</>;
}

export default async function ContactPage() {
  const contact = await getContactContent();

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col page-transition">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="flex flex-col items-start gap-[240px] w-full p-10 flex-1">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-[240px] w-full">
          {/* Left Column - Breadcrumb */}
          <div className="w-full lg:w-[480px] flex-shrink-0">
            <div>
              <Link href="/" className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter hover:opacity-70 transition-opacity">
                Home
              </Link>
              <span className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter mx-2">
                {'>'}
              </span>
              <span className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter">
                Contact
              </span>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 max-w-[1200px]">

            {contact && contact.htmlContent ? (
              <div className="space-y-6">
                {processHtmlContent(contact.htmlContent)}
              </div>
            ) : (
              <p className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter">
                コンテンツを読み込めませんでした。
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

