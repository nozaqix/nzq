import { getAllPosts } from '@/lib/posts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorksGrid from '@/components/WorksGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://nozaqi.work/works/',
  },
};

export default async function WorksPage() {
  const allPosts = getAllPosts('works');
  const worksPosts = allPosts.filter((post) => post.frontmatter.category === 'Works');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col page-transition">
      {/* Header */}
      <Header />

      {/* Main Container - Figma Auto Layout */}
      <div className="flex flex-col items-start gap-[240px] w-full p-6 md:p-10 flex-1">
        <WorksGrid posts={worksPosts} />
      </div>

      {/* Footer - Social Links */}
      <Footer />
    </div>
  );
}

