import Link from 'next/link';
import HeroCard from '@/components/article/HeroCard';
import ArticleCard from '@/components/article/ArticleCard';
import FixtureWeekWidget from '@/components/fixtures/FixtureWeekWidget';
import { Article, Fixture } from '@/types';

// Mock data for initial MVP UI development
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
  title: `Athletics Championships Highlight Local Talent in Lango Region - Part ${i + 1}`,
  excerpt: 'Several promising young athletes caught the eye of national scouts during the weekend track and field events.',
  sport: i % 3 === 0 ? { id: 's2', name: 'Athletics', slug: 'athletics', isMain: false, order: 2 } : mockHeroArticle.sport,
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

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-warm-white py-8 md:py-12 border-b border-pearl-soft">
        <div className="container mx-auto px-4">
          <HeroCard article={mockHeroArticle} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Articles */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-2xl text-dark-text">Latest News</h2>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {/* Sport Tabs */}
                <button className="badge-football text-sm px-4 py-1.5 rounded-full whitespace-nowrap">
                  Football
                </button>
                <button className="btn-outline text-xs px-4 py-1.5 rounded-full whitespace-nowrap text-dark-text border-pearl-soft">
                  Athletics
                </button>
                <button className="btn-outline text-xs px-4 py-1.5 rounded-full whitespace-nowrap text-dark-text border-pearl-soft">
                  Basketball
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button className="btn-outline px-8 py-2">Load More News</button>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8">
            <FixtureWeekWidget initialFixtures={mockFixtures} />

            {/* Promo / Info Box */}
            <div className="card p-6 bg-warm-white border-pearl-soft text-center">
              <div className="w-12 h-12 bg-pearl-red text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">P</div>
              <h3 className="font-bold text-dark-text mb-2">Want to write for Pearlsport?</h3>
              <p className="text-sm text-muted-text mb-4">We are always looking for passionate local sports writers.</p>
              <Link href="/contact" className="btn-primary w-full justify-center">Contact Us</Link>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
