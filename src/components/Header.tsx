import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full p-10">
      <div className="flex justify-between items-start">
        {/* Left: Header Content */}
        <div>
          <Link href="/">
            <h1 className="text-xl text-white font-bold leading-normal tracking-[2px] font-din-next hover:opacity-70 transition-opacity cursor-pointer">
              NZQ
            </h1>
          </Link>
          <p className="text-sm text-white font-normal leading-normal tracking-[0.42px] font-din-next">
            Architecting and creating beautiful things
          </p>
        </div>

        {/* Right: Navigation */}
        <nav className="flex gap-6 text-sm">
          <Link
            href="/works/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Works
          </Link>
          <Link
            href="/contact/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

