'use client';

import { useAuth } from '@/hooks/useAuth';
import { FileText, Calendar, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Published Articles', value: '42', icon: FileText, color: 'text-blue-500' },
    { label: 'Upcoming Fixtures', value: '12', icon: Calendar, color: 'text-green-500' },
    { label: 'Total Views (30d)', value: '18.5k', icon: Eye, color: 'text-purple-500' },
    { label: 'Active Writers', value: '5', icon: Users, color: 'text-orange-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text tracking-tight mb-2">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-text">Here is what's happening with Pearlsport today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-text uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-dark-text">{stat.value}</p>
            </div>
            <div className={`p-4 bg-warm-white rounded-full ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark-text">Recent Drafts</h2>
            <Link href="/dashboard/articles" className="text-sm font-bold text-pearl-red hover:underline">
              View All
            </Link>
          </div>
          
          <div className="card divide-y divide-pearl-soft">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-pearl-light transition-colors">
                <div>
                  <h3 className="font-bold text-dark-text mb-1">Draft Article Title {i}</h3>
                  <p className="text-sm text-muted-text">Last edited 2 hours ago</p>
                </div>
                <Link href={`/dashboard/articles/${i}`} className="btn-outline text-xs px-3 py-1 bg-white">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-dark-text mb-6">Quick Actions</h2>
          <div className="flex flex-col gap-4">
            <Link href="/dashboard/articles/new" className="btn-primary w-full justify-center py-3">
              Write New Article
            </Link>
            <Link href="/dashboard/fixtures" className="btn-outline w-full justify-center py-3 bg-white">
              Add Fixture
            </Link>
            <Link href="/dashboard/media" className="btn-outline w-full justify-center py-3 bg-white">
              Upload Media
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
