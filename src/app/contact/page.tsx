import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://nozaqi.work/contact/',
  },
};

async function getContactContent(): Promise<{ title: string; html: string }> {
  const fullPath = path.join(process.cwd(), 'src/content/contact.mdx');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // 空行を2つ連続で入れた箇所（改行3つ）を段落間スペーサーに置き換える
  const preprocessed = content.replace(
    /([^\n\r])\n\n\n([^\n\r])/g,
    '$1\n[DOUBLE_LINE_BREAK]\n$2'
  );

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { allowDangerousHtml: true })
    .process(preprocessed);

  let html = String(processed);

  html = html.replace(
    /\[DOUBLE_LINE_BREAK\]/g,
    '<div style="height: 0.5rem;"></div>'
  );

  return {
    title: data.title || 'Contact',
    html,
  };
}

export default async function ContactPage() {
  const { title, html } = await getContactContent();

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col page-transition">
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
              <span className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter mx-2">
                {'>'}
              </span>
              <span className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter">
                {title}
              </span>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 w-full min-w-0 max-w-[1600px]">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="space-y-1.5">
                <div className="text-xs text-[#999999] font-normal leading-normal tracking-[0.6px] font-inter">
                  [Contact]
                </div>
                <h1 className="text-xl text-white font-bold leading-normal tracking-[2px] font-din-next">
                  {title}
                </h1>
              </div>

              {/* MDX Body */}
              <div
                className="max-w-none text-xs text-[#B8B9BA] font-normal leading-relaxed tracking-[0.6px] font-inter
                  [&_p]:leading-[1.9]
                  [&_h2]:text-base [&_h2]:text-white [&_h2]:font-bold [&_h2]:tracking-[0.6px] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:first:mt-0
                  [&_h3]:text-sm [&_h3]:text-white [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2 [&_ul]:space-y-1
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2 [&_ol]:space-y-1
                  [&_li>ul]:mt-1 [&_li>ul]:mb-0
                  [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-white [&_a]:transition-colors"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
