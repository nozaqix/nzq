import { getAllPosts } from '@/lib/posts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorksList from '@/components/WorksList';

export default function WorksPage() {
  const allPosts = getAllPosts();
  const releasePosts = allPosts.filter((post) => post.frontmatter.category === 'Release');

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col page-transition">
      {/* Header */}
      <Header />

      {/* Main Container - Figma Auto Layout */}
      <div className="flex flex-col items-start gap-[240px] w-full p-10 flex-1">
        <WorksList posts={releasePosts} />
      </div>

      {/* Footer - Social Links */}
      <Footer />
    </div>
  );
}

