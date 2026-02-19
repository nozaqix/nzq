'use client';

import { useState } from 'react';
import Link from 'next/link';
import SkeletonImage from '@/components/SkeletonImage';

interface PostFrontmatter {
  title: string;
  date: string;
  category: string;
  thumbnail?: string;
}

interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
}

interface PostsListProps {
  posts: Post[];
}

export default function PostsList({ posts }: PostsListProps) {
  const [hoveredThumbnail, setHoveredThumbnail] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 現在表示するサムネイルを決定（ホバー中の記事のサムネイル、またはデフォルト）
  const DEFAULT_THUMBNAIL = 'https://assets.nozaqi.work/nzq/portfolio/images/nzq.png';
  const currentThumbnail = hoveredThumbnail || DEFAULT_THUMBNAIL;

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 w-full min-w-0">
      {/* Left Side - Content */}
      <div className="space-y-10 lg:space-y-12 flex-shrink-0 min-w-0">
        {/* Posts List */}
        <div className="space-y-1.5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/works/${post.slug}/`}
              className="block hover:opacity-70 transition-opacity"
              onMouseEnter={() => {
                setHoveredThumbnail(post.frontmatter.thumbnail || null);
              }}
              onMouseLeave={() => {
                setHoveredThumbnail(null);
              }}
            >
              <span className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter">
                {formatDate(post.frontmatter.date)}
              </span>
              <span className="text-xs text-[#999999] font-normal leading-normal tracking-[0.6px] font-inter ml-4">
                [{post.frontmatter.category}]
              </span>
              <span className="text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter ml-1">
                {post.frontmatter.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:block lg:sticky lg:top-0 lg:self-start flex-shrink min-w-0 w-full max-w-[980px]">
        {currentThumbnail ? (
          <SkeletonImage
            src={currentThumbnail}
            alt="Article Thumbnail"
            width={980}
            height={551}
            className="w-full aspect-video"
            unoptimized
          />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center" style={{ backgroundColor: 'rgb(120 120 120 / 0.4)' }}>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">Illustration Placeholder</p>
              <p className="text-gray-600 text-xs">画像を配置する場合は</p>
              <p className="text-gray-600 text-xs">/public/images/main-visual.jpg に配置</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

