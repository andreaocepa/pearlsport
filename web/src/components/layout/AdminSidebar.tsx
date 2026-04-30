'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Image as ImageIcon, 
  Users, 
  LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
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

  return (
    <div className="w-64 bg-white border-r border-pearl-soft h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-pearl-soft">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pearl-red" />
          <span className="font-bold text-xl tracking-tight text-dark-text">Pearlsport</span>
        </Link>
        <div className="mt-2 text-xs font-bold text-muted-text uppercase tracking-wider">
          Admin Portal
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.name} 
                href={item.href}
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-pearl-light flex items-center justify-center text-pearl-red font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-dark-text truncate">{user?.name}</p>
            <p className="text-xs text-muted-text uppercase font-bold tracking-wider">{user?.role}</p>
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
}
