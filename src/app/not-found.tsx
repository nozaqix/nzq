import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400 mb-8">ページが見つかりませんでした</p>
        <Link
          href="/"
          className="text-gray-400 hover:text-gray-300 transition-colors underline"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}

