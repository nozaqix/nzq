import { getAllPosts } from '@/lib/posts';
import Header from '@/components/Header';
import SubHeader from '@/components/SubHeader';
import Footer from '@/components/Footer';
import PostsList from '@/components/PostsList';

export default async function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col page-transition">
      {/* Header */}
      <Header />

      {/* SubHeader */}
      <div className="w-full p-10">
        <SubHeader />
      </div>

      {/* Main Container - Figma Auto Layout */}
      <div className="flex flex-col items-start gap-[240px] w-full p-10 flex-1">
        <PostsList posts={posts} />
      </div>

      {/* Footer - Social Links */}
      <Footer />
    </div>
  );
}

