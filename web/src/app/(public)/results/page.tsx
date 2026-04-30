import { Fixture } from '@/types';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

// Mock Data
const mockResults: Fixture[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `r${i}`,
  homeTeam: { id: `t${i}`, name: `Home Team ${i}`, slug: `home-team-${i}` },
  awayTeam: { id: `a${i}`, name: `Away Team ${i}`, slug: `away-team-${i}` },
  competition: { id: 'c1', name: 'Lango Super League', slug: 'lsl' },
  sport: { id: 's1', name: 'Football', slug: 'football' },
  kickoffTime: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
  status: 'COMPLETED',
  homeScore: Math.floor(Math.random() * 4),
  awayScore: Math.floor(Math.random() * 4),
  createdAt: new Date().toISOString(),
}));

export default function ResultsPage({ searchParams }: { searchParams: { sport?: string } }) {
  const currentSport = searchParams.sport || 'all';

  return (
    <div className="bg-warm-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-pearl-soft pt-8 md:pt-12">
        <div className="container mx-auto px-4">
          <h1 className="font-bold text-3xl md:text-4xl text-dark-text tracking-tight uppercase mb-6">
            Results
          </h1>

          {/* Sport Filter Tabs */}
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-1">
            <Link 
              href="/results" 
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap ${currentSport === 'all' ? 'text-pearl-red border-pearl-red nav-active' : 'text-muted-text border-transparent hover:text-dark-text'}`}
            >
              All Sports
            </Link>
            <Link 
              href="/results?sport=football" 
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap ${currentSport === 'football' ? 'text-pearl-red border-pearl-red nav-active' : 'text-muted-text border-transparent hover:text-dark-text'}`}
            >
              Football
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="card divide-y divide-pearl-soft">
            {mockResults.map((fixture) => (
              <div key={fixture.id} className="p-4 hover:bg-pearl-light transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  {/* Meta */}
                  <div className="text-xs font-bold text-muted-text uppercase tracking-wider min-w-[120px]">
                    {format(parseISO(fixture.kickoffTime), 'dd MMM yyyy')}
                  </div>
                  
                  {/* Match Info */}
                  <div className="flex-1 flex items-center justify-between md:justify-start gap-4">
                    <span className={`font-bold text-sm ${fixture.homeScore! > fixture.awayScore! ? 'text-dark-text' : 'text-muted-text'}`}>
                      {fixture.homeTeam.name}
                    </span>
                    
                    <span className="vs-chip min-w-[4rem] text-center text-lg">
                      {fixture.homeScore} - {fixture.awayScore}
                    </span>
                    
                    <span className={`font-bold text-sm ${fixture.awayScore! > fixture.homeScore! ? 'text-dark-text' : 'text-muted-text'}`}>
                      {fixture.awayTeam.name}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link href={`/${fixture.sport.slug}/match-report-${fixture.id}`} className="text-xs font-bold text-pearl-red hover:underline">
                    Match Report →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button className="btn-outline px-8 py-2 bg-white">Load More Results</button>
          </div>
        </div>
      </div>
    </div>
  );
}
