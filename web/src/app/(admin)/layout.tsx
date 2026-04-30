'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!mounted || isLoading) return;
    
    const isLoginPage = pathname === '/login';
    
    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    } else if (isAuthenticated && isLoginPage) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pearl-soft border-t-pearl-red rounded-full animate-spin" />
      </div>
    );
  }

  // If on login page, don't show sidebar
  if (pathname === '/login') {
    return <main className="min-h-screen bg-warm-white">{children}</main>;
  }

  // If authenticated and not on login page, show full layout
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-warm-white">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return null;
}
