import Link from 'next/link';
import ArticleCard from '@/components/article/ArticleCard';
import FixtureWeekWidget from '@/components/fixtures/FixtureWeekWidget';
import HeroCard from '@/components/article/HeroCard';
import { Article, Fixture } from '@/types';

// Mock Data
const mockHeroArticle: Article = {
  id: '1',
  title: 'Lira FC Secures Thrilling Last-Minute Victory in Regional Derby',
  slug: 'lira-fc-secures-thrilling-victory',
  excerpt: 'A 94th-minute header from captain Otim Emmanuel sent the home crowd into raptures as Lira FC defeated rivals Apach FC 2-1.',
  body: {},
  status: 'PUBLISHED',
  isFeatured: true,
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: { id: 'a1', name: 'John Doe', isActive: true, email: '', role: 'WRITER', createdAt: '' },
  sport: { id: 's1', name: 'Football', slug: 'football', isMain: true, order: 1 },
  tags: [],
};

const mockArticles: Article[] = Array.from({ length: 6 }).map((_, i) => ({
  ...mockHeroArticle,
  id: `list-${i}`,
  title: `Match Report: Local Teams Battle It Out - Part ${i + 1}`,
  excerpt: 'A detailed breakdown of the key moments that defined the game.',
}));

const mockFixtures: Fixture[] = [
  {
    id: 'f1',
    homeTeam: { id: 't1', name: 'Lira FC', slug: 'lira-fc' },
    awayTeam: { id: 't2', name: 'Gulu United', slug: 'gulu-united' },
    competition: { id: 'c1', name: 'Lango Super League', slug: 'lsl' },
    sport: { id: 's1', name: 'Football', slug: 'football' },
    kickoffTime: new Date().toISOString(),
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
  },
];

export default function SportPage({ params }: { params: { sport: string } }) {
  const sportName = params.sport.charAt(0).toUpperCase() + params.sport.slice(1);

  return (
    <div className="w-full">
      {/* Sport Banner */}
      <div className="bg-pearl-light py-8 md:py-12 border-b border-pearl-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-end gap-4 mb-8">
            <h1 className="font-bold text-4xl md:text-5xl text-dark-text tracking-tight uppercase">
              {sportName}
            </h1>
            <div className="w-12 h-2 bg-pearl-red mb-2" />
          </div>

          <HeroCard article={mockHeroArticle} />
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div className="border-b border-pearl-soft sticky top-16 bg-white z-40">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 text-sm font-bold uppercase tracking-wider">
            <button className="py-4 text-pearl-red border-b-2 border-pearl-red nav-active">
              News
            </button>
            <Link href={`/fixtures?sport=${params.sport}`} className="py-4 text-muted-text hover:text-dark-text transition-colors">
              Fixtures
            </Link>
            <Link href={`/results?sport=${params.sport}`} className="py-4 text-muted-text hover:text-dark-text transition-colors">
              Results
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Articles Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <div className="mt-12 flex justify-between items-center border-t border-pearl-soft pt-6">
              <button className="btn-outline px-6 py-2 opacity-50 cursor-not-allowed">Previous</button>
              <span className="text-sm font-bold text-muted-text">Page 1 of 5</span>
              <button className="btn-outline px-6 py-2">Next Page</button>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8">
            <FixtureWeekWidget initialFixtures={mockFixtures} />
          </div>
          
        </div>
      </section>
    </div>
  );
}
