import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full pt-6 md:pt-10">
      <div className="px-6 md:px-10">
        {/* Navigation at top left */}
        <nav className="flex gap-6 text-[13px] mb-[80px]">
        <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Index
          </Link>
          <Link
            href="/works/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Works
          </Link>
        </nav>

        {/* Logo below navigation */}
        <div>
          <Link href="/">
            <h1 className="text-xl text-white font-bold leading-normal tracking-[2px] font-din-next hover:opacity-70 transition-opacity cursor-pointer">
              NZQ
            </h1>
          </Link>
        </div>
      </div>
      <p className="text-sm text-white font-normal leading-normal tracking-[0.42px] font-din-next pl-6 pr-0 md:px-10">
        Architecting and creating beautiful things
      </p>
    </header>
  );
}

