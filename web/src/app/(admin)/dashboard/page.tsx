'use client';

import { useAuth } from '@/hooks/useAuth';
import { FileText, Calendar, Users, Star, Clock, CheckCircle, Trophy, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Published', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', href: '/dashboard/articles' },
  { label: 'In Review', value: '3', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', href: '/dashboard/articles' },
  { label: 'Drafts', value: '5', icon: FileText, color: 'text-gray-500', bg: 'bg-gray-50', href: '/dashboard/articles' },
  { label: 'Featured', value: '1', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50', href: '/dashboard/articles' },
  { label: 'Upcoming Fixtures', value: '8', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', href: '/dashboard/fixtures' },
  { label: 'Results', value: '2', icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', href: '/dashboard/fixtures' },
  { label: 'Active Writers', value: '3', icon: Users, color: 'text-pink-600', bg: 'bg-pink-50', href: '/dashboard/team' },
  { label: 'Total Views (30d)', value: '18.5k', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50', href: '#' },
];

const recentDrafts = [
  { id: 'a1', title: 'Athletics Championships: Lango Talent Shines', sport: 'Athletics', author: 'Jane Editor', ago: '2 hours ago' },
  { id: 'a4', title: 'Boxing Gala Night Preview: Lira Edition', sport: 'Boxing', author: 'John Doe', ago: '4 hours ago' },
  { id: 'a7', title: 'Athletics: Road to FUFA Qualifiers Analysis', sport: 'Athletics', author: 'Jane Editor', ago: '1 day ago' },
];

const reviewQueue = [
  { id: 'a2', title: 'Basketball League Kicks Off This Weekend', sport: 'Basketball', author: 'John Doe' },
  { id: 'a5', title: 'Gulu United vs Arua Hill: Match Preview', sport: 'Football', author: 'Jane Editor' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text tracking-tight mb-1">
          Welcome back, {user?.name?.split(' ')[0] || 'Editor'} 👋
        </h1>
        <p className="text-muted-text">Here is what&apos;s happening with Pearlsport today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow group">
            <div className={`p-2.5 rounded-lg ${stat.bg} flex-shrink-0`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-text uppercase tracking-wider leading-none mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-dark-text leading-none">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Drafts + Review Queue */}
        <div className="lg:col-span-2 space-y-6">

          {/* Review Queue */}
          {reviewQueue.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full inline-block"></span>
                  Needs Review ({reviewQueue.length})
                </h2>
                <Link href="/dashboard/articles" className="text-sm font-bold text-pearl-red hover:underline">View All</Link>
              </div>
              <div className="card divide-y divide-pearl-soft">
                {reviewQueue.map((a) => (
                  <div key={a.id} className="p-4 flex items-center justify-between gap-4 hover:bg-pearl-light transition-colors">
                    <div className="min-w-0">
                      <p className="font-bold text-dark-text text-sm truncate">{a.title}</p>
                      <p className="text-xs text-muted-text mt-0.5">{a.sport} · By {a.author}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/dashboard/articles/${a.id}`}
                        className="text-xs font-bold text-pearl-red border border-pearl-red/30 bg-pearl-light px-3 py-1.5 rounded hover:bg-pearl-red hover:text-white transition-colors">
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Drafts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-dark-text">Recent Drafts</h2>
              <Link href="/dashboard/articles" className="text-sm font-bold text-pearl-red hover:underline">View All</Link>
            </div>
            <div className="card divide-y divide-pearl-soft">
              {recentDrafts.map((a) => (
                <div key={a.id} className="p-4 flex items-center justify-between gap-4 hover:bg-pearl-light transition-colors">
                  <div className="min-w-0">
                    <p className="font-bold text-dark-text text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-text mt-0.5">{a.sport} · {a.author} · {a.ago}</p>
                  </div>
                  <Link href={`/dashboard/articles/${a.id}`}
                    className="text-xs font-bold text-muted-text border border-pearl-soft bg-white px-3 py-1.5 rounded hover:bg-pearl-light transition-colors flex-shrink-0">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-dark-text mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/articles/new"
              className="btn-primary w-full justify-center py-3 text-sm">
              ✏️ &nbsp; Write New Article
            </Link>
            <Link href="/dashboard/fixtures"
              className="btn-outline w-full justify-center py-3 bg-white text-sm">
              📅 &nbsp; Add Fixture
            </Link>
            <Link href="/dashboard/media"
              className="btn-outline w-full justify-center py-3 bg-white text-sm">
              🖼️ &nbsp; Upload Media
            </Link>
            <Link href="/dashboard/team"
              className="btn-outline w-full justify-center py-3 bg-white text-sm">
              👥 &nbsp; Manage Team
            </Link>
          </div>

          {/* Featured article notice */}
          <div className="mt-6 card p-4 bg-yellow-50 border border-yellow-100">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-yellow-500 fill-yellow-400" />
              <p className="text-sm font-bold text-dark-text">Homepage Featured</p>
            </div>
            <p className="text-xs text-muted-text leading-relaxed">
              &ldquo;Lira FC Secures Last-Minute Derby Victory&rdquo; is currently featured on the homepage hero.
            </p>
            <Link href="/dashboard/articles" className="text-xs font-bold text-pearl-red hover:underline mt-2 block">
              Change featured article →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
