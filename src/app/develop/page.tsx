import { getAllPosts } from '@/lib/posts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorksList from '@/components/WorksList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://nozaqi.work/develop/',
  },
  openGraph: {
    title: 'Develop - NZQ',
    url: 'https://nozaqi.work/develop/',
    type: 'website',
  },
};

export default async function DevelopPage() {
  const developPosts = getAllPosts('develop');

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col page-transition">
      <Header />

      <div className="flex flex-col items-start gap-[240px] w-full p-6 md:p-10 flex-1">
        <WorksList posts={developPosts} basePath="/develop" />
      </div>

      <Footer />
    </div>
  );
}
