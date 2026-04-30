// ── Shared Pearlsport TypeScript Types ────────────────────────────────────────

export type Role = 'WRITER' | 'EDITOR' | 'ADMIN';
export type ArticleStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED';
export type FixtureStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED';
export type CompetitionType = 'LEAGUE' | 'CUP' | 'FRIENDLY' | 'TOURNAMENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Sport {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isMain: boolean;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: Record<string, unknown>;
  bodyText?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  status: ArticleStatus;
  isFeatured: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  sport: Pick<Sport, 'id' | 'name' | 'slug'>;
  tags: Tag[];
  fixture?: Fixture;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  homeGround?: string;
  district?: string;
  bio?: string;
  foundedYear?: number;
  sport: Pick<Sport, 'name' | 'slug'>;
}

export interface Competition {
  id: string;
  name: string;
  slug: string;
  season: string;
  type: CompetitionType;
  region?: string;
  logoUrl?: string;
  isActive: boolean;
  sport: Pick<Sport, 'name' | 'slug'>;
}

export interface Fixture {
  id: string;
  homeTeam: Pick<Team, 'id' | 'name' | 'slug' | 'logoUrl'>;
  awayTeam: Pick<Team, 'id' | 'name' | 'slug' | 'logoUrl'>;
  competition: Pick<Competition, 'id' | 'name' | 'slug'>;
  sport: Pick<Sport, 'id' | 'name' | 'slug'>;
  kickoffTime: string;
  venue?: string;
  status: FixtureStatus;
  homeScore?: number;
  awayScore?: number;
  notes?: string;
  matchReport?: Article;
  createdAt: string;
}

export interface Media {
  id: string;
  url: string;
  storagePath: string;
  altText?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  uploadedBy: string;
  createdAt: string;
}

export interface PaginatedArticles {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchResult {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImageUrl?: string;
    publishedAt?: string;
    authorName: string;
    sportName: string;
    sportSlug: string;
  }>;
  query: string;
  page: number;
}
