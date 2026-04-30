import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import SportBadge from '../ui/SportBadge';
import { formatRelative } from '@/lib/utils';

interface HeroCardProps {
  article: Article;
}

export default function HeroCard({ article }: HeroCardProps) {
  return (
    <Link href={`/${article.sport.slug}/${article.slug}`} className="block group">
      <div className="bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-pearl-soft border-l-4 border-l-pearl-red flex flex-col md:flex-row relative">
        {/* Subtle background wash on hover */}
        <div className="absolute inset-0 bg-pearl-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Image Side */}
        <div className="relative w-full md:w-[60%] aspect-[16/9] md:aspect-auto bg-warm-white">
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.coverImageAlt || article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-text font-bold text-3xl opacity-20">Pearlsport</span>
            </div>
          )}
        </div>

        {/* Content Side */}
        <div className="p-6 md:p-8 lg:p-12 w-full md:w-[40%] flex flex-col justify-center relative z-10 bg-white group-hover:bg-transparent transition-colors duration-300">
          <div className="mb-4">
            <SportBadge sportSlug={article.sport.slug} sportName={article.sport.name} />
          </div>
          
          <h2 className="font-bold text-2xl md:text-3xl leading-tight text-dark-text mb-4">
            {article.title}
          </h2>
          
          <p className="text-dark-text opacity-90 mb-6 line-clamp-3 text-base">
            {article.excerpt}
          </p>
          
          <div className="flex items-center text-sm text-muted-text font-medium mt-auto">
            <span>By {article.author.name}</span>
            <span className="mx-2">•</span>
            <span>{article.publishedAt ? formatRelative(article.publishedAt) : 'Draft'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
