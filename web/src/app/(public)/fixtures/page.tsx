import FixtureWeekWidget from '@/components/fixtures/FixtureWeekWidget';
import { Fixture } from '@/types';
import Link from 'next/link';

// Mock Data
const mockFixtures: Fixture[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `f${i}`,
  homeTeam: { id: `t${i}`, name: `Home Team ${i}`, slug: `home-team-${i}` },
  awayTeam: { id: `a${i}`, name: `Away Team ${i}`, slug: `away-team-${i}` },
  competition: { id: 'c1', name: 'Lango Super League', slug: 'lsl' },
  sport: { id: 's1', name: 'Football', slug: 'football' },
  kickoffTime: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
  status: 'UPCOMING',
  createdAt: new Date().toISOString(),
}));

export default function FixturesPage({ searchParams }: { searchParams: { sport?: string } }) {
  const currentSport = searchParams.sport || 'all';

  return (
    <div className="bg-warm-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-pearl-soft pt-8 md:pt-12">
        <div className="container mx-auto px-4">
          <h1 className="font-bold text-3xl md:text-4xl text-dark-text tracking-tight uppercase mb-6">
            Fixtures
          </h1>

          {/* Sport Filter Tabs */}
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-1">
            <Link 
              href="/fixtures" 
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap ${currentSport === 'all' ? 'text-pearl-red border-pearl-red nav-active' : 'text-muted-text border-transparent hover:text-dark-text'}`}
            >
              All Sports
            </Link>
            <Link 
              href="/fixtures?sport=football" 
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap ${currentSport === 'football' ? 'text-pearl-red border-pearl-red nav-active' : 'text-muted-text border-transparent hover:text-dark-text'}`}
            >
              Football
            </Link>
            <Link 
              href="/fixtures?sport=athletics" 
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap ${currentSport === 'athletics' ? 'text-pearl-red border-pearl-red nav-active' : 'text-muted-text border-transparent hover:text-dark-text'}`}
            >
              Athletics
            </Link>
            <Link 
              href="/fixtures?sport=basketball" 
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap ${currentSport === 'basketball' ? 'text-pearl-red border-pearl-red nav-active' : 'text-muted-text border-transparent hover:text-dark-text'}`}
            >
              Basketball
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* We reuse the FixtureWeekWidget for the UI layout, but in a real page we might build a specific full-page calendar view. */}
          <div className="shadow-card rounded-card overflow-hidden">
            <FixtureWeekWidget initialFixtures={mockFixtures} />
          </div>
        </div>
      </div>
    </div>
  );
}
