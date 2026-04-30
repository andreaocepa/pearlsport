import Link from 'next/link';
import { Search, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-pearl-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pearl-red" />
          <span className="font-bold text-xl tracking-tight text-dark-text">Pearlsport</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-sm">
          <Link href="/" className="text-dark-text hover:text-pearl-red transition-colors nav-active">
            Home
          </Link>
          <div className="group relative py-4">
            <Link href="/football" className="text-dark-text hover:text-pearl-red transition-colors flex items-center gap-1">
              Football
              <span className="text-[10px]">▼</span>
            </Link>
            <div className="absolute top-full left-0 w-48 bg-white border border-pearl-soft shadow-card-hover rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
              <Link href="/football" className="px-4 py-2 hover:bg-pearl-light text-dark-text">Latest News</Link>
              <Link href="/football/fixtures" className="px-4 py-2 hover:bg-pearl-light text-dark-text">Fixtures & Results</Link>
            </div>
          </div>
          <div className="group relative py-4">
            <span className="text-dark-text hover:text-pearl-red transition-colors cursor-pointer flex items-center gap-1">
              Sports
              <span className="text-[10px]">▼</span>
            </span>
            <div className="absolute top-full left-0 w-48 bg-white border border-pearl-soft shadow-card-hover rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
              <Link href="/athletics" className="px-4 py-2 hover:bg-pearl-light text-dark-text">Athletics</Link>
              <Link href="/basketball" className="px-4 py-2 hover:bg-pearl-light text-dark-text">Basketball</Link>
              <Link href="/boxing" className="px-4 py-2 hover:bg-pearl-light text-dark-text">Boxing</Link>
              <Link href="/rugby" className="px-4 py-2 hover:bg-pearl-light text-dark-text">Rugby</Link>
            </div>
          </div>
          <Link href="/fixtures" className="text-dark-text hover:text-pearl-red transition-colors">
            Fixtures
          </Link>
          <Link href="/results" className="text-dark-text hover:text-pearl-red transition-colors">
            Results
          </Link>
        </nav>

        {/* Search & Mobile */}
        <div className="flex items-center gap-4">
          <Link href="/search" className="text-dark-text hover:text-pearl-red transition-colors">
            <Search size={20} />
          </Link>
          <button className="md:hidden text-dark-text">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
