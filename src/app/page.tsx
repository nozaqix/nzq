import { getAllPosts } from '@/lib/posts';
import Header from '@/components/Header';
import SubHeader from '@/components/SubHeader';
import Footer from '@/components/Footer';
import PostsList from '@/components/PostsList';
import ImagePreloader from '@/components/ImagePreloader';
import SkeletonTest from '@/components/SkeletonTest';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://nozaqi.work/',
  },
};

export default async function Home() {
  const posts = getAllPosts();
  
  // プリロードする画像URLのリストを作成
  const DEFAULT_THUMBNAIL = 'https://assets.nozaqi.work/images/nzq.png';
  const imageUrls = [DEFAULT_THUMBNAIL];
  
  // 各記事のサムネイルを追加（重複を除去）
  posts.forEach((post) => {
    if (post.frontmatter.thumbnail && !imageUrls.includes(post.frontmatter.thumbnail)) {
      imageUrls.push(post.frontmatter.thumbnail);
    }
  });

  return (
    <ImagePreloader imageUrls={imageUrls}>
      <div className="min-h-screen bg-[#111] text-white flex flex-col page-transition">
        {/* Header */}
        <Header />

        {/* SubHeader */}
        <div className="w-full p-6 md:p-10">
          <SubHeader />
        </div>

        {/* スケルトンスクリーン確認用 */}
        <div className="w-full p-6 md:p-10">
          <SkeletonTest />
        </div>

        {/* Main Container - Figma Auto Layout */}
        <div className="flex flex-col items-start gap-[240px] w-full p-6 md:p-10 flex-1">
          <PostsList posts={posts} />
        </div>

        {/* Footer - Social Links */}
        <Footer />
      </div>
    </ImagePreloader>
  );
}

