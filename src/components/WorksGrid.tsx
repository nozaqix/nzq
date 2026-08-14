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
  section?: string;
  frontmatter: PostFrontmatter;
}

interface WorksGridProps {
  posts: Post[];
  basePath?: string;
}

export default function WorksGrid({ posts, basePath = '/works' }: WorksGridProps) {
  return (
    <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-10 md:gap-x-16 gap-y-16 md:gap-y-20">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/${post.section || basePath.replace(/^\//, '')}/${post.slug}/`}
          className="block group"
        >
          <div className="relative w-full aspect-video overflow-hidden">
            {post.frontmatter.thumbnail ? (
              <SkeletonImage
                src={post.frontmatter.thumbnail}
                alt={post.frontmatter.title}
                width={980}
                height={551}
                className="w-full aspect-video transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                unoptimized
              />
            ) : (
              <div
                className="w-full aspect-video flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                style={{ backgroundColor: 'rgb(120 120 120 / 0.4)' }}
              >
                <p className="text-gray-500 text-xs">No Image</p>
              </div>
            )}
            {/* ホバー時のシャイン */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            {/* ホバー時の枠光 */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/0 transition-all duration-500 group-hover:ring-white/25" />
          </div>
          <p className="mt-4 text-sm text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-inter transition-colors duration-300 group-hover:text-white">
            {post.frontmatter.title}
          </p>
        </Link>
      ))}
    </div>
  );
}
