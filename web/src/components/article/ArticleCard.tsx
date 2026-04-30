import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import SportBadge from '../ui/SportBadge';
import { formatRelative, truncate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/${article.sport.slug}/${article.slug}`} className="block group">
      <div className="card h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[16/9] w-full bg-pearl-soft overflow-hidden">
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.coverImageAlt || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-warm-white">
              <span className="text-muted-text font-bold text-2xl opacity-20">Pearlsport</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 z-10">
            <SportBadge sportSlug={article.sport.slug} sportName={article.sport.name} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow bg-white group-hover:bg-pearl-light transition-colors duration-200">
          <h3 className="font-bold text-[15px] leading-tight text-dark-text mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-text line-clamp-2 mb-3 flex-grow">
            {article.excerpt}
          </p>
          <div className="flex items-center text-xs text-muted-text font-medium mt-auto">
            <span>{truncate(article.author.name, 20)}</span>
            <span className="mx-2">•</span>
            <span>{article.publishedAt ? formatRelative(article.publishedAt) : 'Draft'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
