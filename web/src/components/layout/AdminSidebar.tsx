'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { X } from 'lucide-react';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image as ImageIcon,
  Users,
  LogOut,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Articles', href: '/dashboard/articles', icon: FileText },
    { name: 'Fixtures', href: '/dashboard/fixtures', icon: Calendar },
    { name: 'Media', href: '/dashboard/media', icon: ImageIcon },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Team', href: '/dashboard/team', icon: Users });
  }

  const sidebarContent = (
    <div className="w-64 bg-white border-r border-pearl-soft h-full flex flex-col">
      <div className="p-6 border-b border-pearl-soft flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-3 h-3 rounded-full bg-pearl-red" />
          <span className="font-bold text-xl tracking-tight text-dark-text">Pearlsport</span>
        </Link>
        {/* Close button — only visible on mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-1 text-muted-text hover:text-pearl-red transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>
      <div className="text-xs font-bold text-muted-text uppercase tracking-wider px-6 pt-3 pb-1">
        Admin Portal
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-pearl-light text-pearl-red'
                    : 'text-dark-text hover:bg-warm-white'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-pearl-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-pearl-light flex items-center justify-center text-pearl-red font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-dark-text truncate">{user?.name}</p>
            <p className="text-xs text-muted-text uppercase font-bold tracking-wider">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-muted-text hover:text-pearl-red transition-colors w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className="hidden md:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile overlay drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="md:hidden fixed inset-y-0 left-0 z-50 h-full flex flex-col" style={{ animation: 'slideInLeft 0.25s ease' }}>
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
