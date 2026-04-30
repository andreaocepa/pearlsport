'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  {
    name: 'Football',
    href: '/football',
    children: [
      { name: 'Latest News', href: '/football' },
      { name: 'Fixtures & Results', href: '/football/fixtures' },
    ],
  },
  {
    name: 'Sports',
    href: '#',
    children: [
      { name: 'Athletics', href: '/athletics' },
      { name: 'Basketball', href: '/basketball' },
      { name: 'Boxing', href: '/boxing' },
      { name: 'Rugby', href: '/rugby' },
    ],
  },
  { name: 'Fixtures', href: '/fixtures' },
  { name: 'Results', href: '/results' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-pearl-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={closeMobile}>
          <div className="w-3 h-3 rounded-full bg-pearl-red" />
          <span className="font-bold text-xl tracking-tight text-dark-text">Pearlsport</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-sm">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.name} className="group relative py-4">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 transition-colors hover:text-pearl-red ${
                    pathname.startsWith(link.href) && link.href !== '#'
                      ? 'text-pearl-red'
                      : 'text-dark-text'
                  }`}
                >
                  {link.name}
                  <ChevronDown size={13} />
                </Link>
                <div className="absolute top-full left-0 w-48 bg-white border border-pearl-soft shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 flex flex-col py-2 z-50">
                  {link.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="px-4 py-2 hover:bg-pearl-light text-dark-text text-sm transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors hover:text-pearl-red ${
                  pathname === link.href ? 'text-pearl-red' : 'text-dark-text'
                }`}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        {/* Search & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link href="/search" className="text-dark-text hover:text-pearl-red transition-colors" aria-label="Search">
            <Search size={20} />
          </Link>
          <button
            className="md:hidden text-dark-text hover:text-pearl-red transition-colors p-1"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-pearl-soft shadow-lg animate-slideUp">
          <nav className="flex flex-col divide-y divide-pearl-soft">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.name}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 font-semibold text-dark-text hover:text-pearl-red hover:bg-pearl-light transition-colors"
                    onClick={() =>
                      setOpenDropdown(openDropdown === link.name ? null : link.name)
                    }
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openDropdown === link.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === link.name && (
                    <div className="bg-warm-white border-t border-pearl-soft">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={closeMobile}
                          className="block px-8 py-3 text-sm text-dark-text hover:text-pearl-red hover:bg-pearl-light transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMobile}
                  className={`block px-4 py-4 font-semibold transition-colors hover:bg-pearl-light hover:text-pearl-red ${
                    pathname === link.href ? 'text-pearl-red bg-pearl-light' : 'text-dark-text'
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}

            {/* Search in mobile menu */}
            <Link
              href="/search"
              onClick={closeMobile}
              className="flex items-center gap-3 px-4 py-4 font-semibold text-dark-text hover:text-pearl-red hover:bg-pearl-light transition-colors"
            >
              <Search size={18} />
              Search
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
