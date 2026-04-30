import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleBody from '@/components/article/ArticleBody';
import ShareBar from '@/components/ui/ShareBar';
import SportBadge from '@/components/ui/SportBadge';
import { formatDate } from '@/lib/utils';
import { Article } from '@/types';

// Using mock data for UI building
const mockArticle: Article = {
  id: '1',
  title: 'Lira FC Secures Thrilling Last-Minute Victory in Regional Derby',
  slug: 'lira-fc-secures-thrilling-victory',
  excerpt: 'A 94th-minute header from captain Otim Emmanuel sent the home crowd into raptures as Lira FC defeated rivals Apach FC 2-1.',
  body: {
    type: 'doc',
    content: [
      { type: 'paragraph', content: [{ type: 'text', text: 'The atmosphere at the Lira Town Stadium was electric as two of the region\'s most fierce competitors faced off in what will be remembered as a classic.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'A Tense First Half' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Both teams started cautiously, with midfield battles dominating the first 45 minutes. Apach FC took the lead shortly before the break with a stunning free-kick from 25 yards out.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'The Comeback' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Lira FC emerged with renewed vigor in the second half. The equalizer came in the 68th minute through a well-worked team goal. Just when the match seemed destined for a draw, Otim Emmanuel rose highest to meet a corner kick deep into stoppage time.' }] }
    ]
  },
  coverImageUrl: 'https://images.unsplash.com/photo-1518605368461-1ee7e54f0a28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  coverImageAlt: 'Football players celebrating',
  status: 'PUBLISHED',
  isFeatured: true,
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: { id: 'a1', name: 'John Doe', isActive: true, email: '', role: 'WRITER', createdAt: '' },
  sport: { id: 's1', name: 'Football', slug: 'football', isMain: true, order: 1 },
  tags: [{ id: 'tag1', name: 'Lango Super League', slug: 'lango-super-league' }, { id: 'tag2', name: 'Match Report', slug: 'match-report' }],
};

export default function ArticlePage({ params }: { params: { sport: string; slug: string } }) {
  // In a real implementation, we would fetch the article via slug from API
  // if (!article) notFound();
  
  const article = mockArticle;

  return (
    <div className="bg-white">
      {/* Cover Image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] bg-warm-white">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-text font-bold text-4xl opacity-20">Pearlsport</span>
          </div>
        )}
        
        {/* Gradient Overlay for Text Readability if we wanted to overlay text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:opacity-0" />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 -mt-16 md:-mt-24 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-t-card md:rounded-card p-6 md:p-10 shadow-card">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <SportBadge sportSlug={article.sport.slug} sportName={article.sport.name} />
              <span className="text-muted-text text-sm font-medium">
                {article.publishedAt ? formatDate(article.publishedAt) : 'Draft'}
              </span>
            </div>
            
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-dark-text mb-6">
              {article.title}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-text font-medium leading-relaxed">
              {article.excerpt}
            </p>
          </header>

          {/* Author Byline */}
          <div className="flex items-center gap-4 py-6 border-y border-pearl-soft mb-8">
            <div className="w-12 h-12 rounded-full bg-pearl-light flex items-center justify-center overflow-hidden flex-shrink-0">
              {article.author.avatarUrl ? (
                <Image src={article.author.avatarUrl} alt={article.author.name} width={48} height={48} className="object-cover" />
              ) : (
                <span className="text-pearl-red font-bold text-lg">{article.author.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-bold text-dark-text leading-none mb-1">{article.author.name}</p>
              <p className="text-sm text-muted-text">Pearlsport Staff Writer</p>
            </div>
          </div>

          {/* Body */}
          <article>
            <ArticleBody content={article.body} />
          </article>

          {/* Share & Tags */}
          <footer className="mt-8">
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map(tag => (
                <Link 
                  key={tag.id} 
                  href={`/search?tag=${tag.slug}`}
                  className="bg-warm-white text-muted-text hover:text-pearl-red text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>

            <ShareBar 
              title={article.title} 
              url={`https://pearlsport.it/${article.sport.slug}/${article.slug}`} 
            />
          </footer>
        </div>
      </div>
    </div>
  );
}
