'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stableCheckAuth = useCallback(checkAuth, []);

  useEffect(() => {
    setMounted(true);
    stableCheckAuth();
  }, [stableCheckAuth]);

  useEffect(() => {
    if (!mounted || isLoading) return;
    const isLoginPage = pathname === '/login';
    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    } else if (isAuthenticated && isLoginPage) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router, mounted]);

  // Close sidebar when route changes (mobile nav)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pearl-soft border-t-pearl-red rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === '/login') {
    return <main className="min-h-screen bg-warm-white">{children}</main>;
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-warm-white relative">
        <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <div className="md:hidden sticky top-0 z-30 bg-white border-b border-pearl-soft px-4 h-14 flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-dark-text hover:text-pearl-red hover:bg-pearl-light rounded-md transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            <span className="font-bold text-dark-text text-lg tracking-tight">Pearlsport</span>
          </div>

          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return null;
}
