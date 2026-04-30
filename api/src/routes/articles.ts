import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';
import { slugify, paginate } from '../utils/helpers';
import { getCache, setCache, invalidateCache, CACHE_TTL } from '../lib/cache';
import { ArticleStatus } from '@prisma/client';

const router = Router();

const ArticleSchema = z.object({
  title: z.string().min(3).max(255),
  excerpt: z.string().max(300),
  body: z.record(z.unknown()),
  bodyText: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  coverImageAlt: z.string().optional(),
  sportId: z.string().cuid(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  fixtureId: z.string().cuid().optional(),
});

const articleInclude = {
  author: { select: { id: true, name: true, avatarUrl: true } },
  sport: { select: { id: true, name: true, slug: true } },
  tags: { select: { id: true, name: true, slug: true } },
};

// GET /api/v1/articles
router.get('/', async (req: Request, res: Response) => {
  const { sport, tag, page = '1', limit = '12' } = req.query as Record<string, string>;
  const { take, skip } = paginate(parseInt(page), parseInt(limit));
  const cacheKey = `articles:list:${sport || 'all'}:${tag || 'none'}:${page}`;

  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const where: any = { status: 'PUBLISHED' };
  if (sport) where.sport = { slug: sport };
  if (tag) where.tags = { some: { slug: tag } };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: articleInclude,
      orderBy: { publishedAt: 'desc' },
      take,
      skip,
    }),
    prisma.article.count({ where }),
  ]);

  const result = { articles, total, page: parseInt(page), limit: take };
  await setCache(cacheKey, result, CACHE_TTL.ARTICLE_LIST);
  res.json(result);
});

// GET /api/v1/articles/featured
router.get('/featured', async (_req: Request, res: Response) => {
  const cached = await getCache('articles:featured');
  if (cached) return res.json(cached);

  const article = await prisma.article.findFirst({
    where: { status: 'PUBLISHED', isFeatured: true },
    include: articleInclude,
    orderBy: { publishedAt: 'desc' },
  });

  if (!article) return res.status(404).json({ error: 'No featured article found' });
  await setCache('articles:featured', article, CACHE_TTL.FEATURED);
  res.json(article);
});

// GET /api/v1/articles/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  const article = await prisma.article.findUnique({
    where: { slug: req.params.slug, status: 'PUBLISHED' },
    include: { ...articleInclude, fixture: true },
  });
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// POST /api/v1/articles
router.post('/', verifyToken, requireRole('WRITER'), async (req: AuthRequest, res: Response) => {
  const parsed = ArticleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { tags, ...data } = parsed.data;
  const slug = slugify(data.title);

  const article = await prisma.article.create({
    data: {
      ...data,
      slug,
      authorId: req.user!.id,
      coverImageUrl: data.coverImageUrl || undefined,
      tags: tags ? { connect: tags.map((id) => ({ id })) } : undefined,
    },
    include: articleInclude,
  });

  await invalidateCache(`articles:list:all:none:1`);
  res.status(201).json(article);
});

// PUT /api/v1/articles/:id
router.put('/:id', verifyToken, requireRole('WRITER'), async (req: AuthRequest, res: Response) => {
  const parsed = ArticleSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await prisma.article.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Article not found' });

  // Writers can only edit their own articles
  if (req.user!.role === 'WRITER' && existing.authorId !== req.user!.id) {
    return res.status(403).json({ error: 'Cannot edit another writer\'s article' });
  }

  const { tags, ...data } = parsed.data;
  const article = await prisma.article.update({
    where: { id: req.params.id },
    data: {
      ...data,
      tags: tags ? { set: tags.map((id) => ({ id })) } : undefined,
    },
    include: articleInclude,
  });

  await invalidateCache('articles:featured', `articles:list:all:none:1`);
  res.json(article);
});

// PATCH /api/v1/articles/:id/submit
router.patch('/:id/submit', verifyToken, requireRole('WRITER'), async (req: AuthRequest, res: Response) => {
  const article = await prisma.article.update({
    where: { id: req.params.id },
    data: { status: ArticleStatus.REVIEW },
  });
  res.json(article);
});

// PATCH /api/v1/articles/:id/publish
router.patch('/:id/publish', verifyToken, requireRole('EDITOR'), async (req: AuthRequest, res: Response) => {
  const article = await prisma.article.update({
    where: { id: req.params.id },
    data: { status: ArticleStatus.PUBLISHED, publishedAt: new Date() },
  });
  await invalidateCache('articles:featured', `articles:list:all:none:1`);
  res.json(article);
});

// PATCH /api/v1/articles/:id/feature
router.patch('/:id/feature', verifyToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  const existing = await prisma.article.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Article not found' });
  const article = await prisma.article.update({
    where: { id: req.params.id },
    data: { isFeatured: !existing.isFeatured },
  });
  await invalidateCache('articles:featured');
  res.json(article);
});

// DELETE /api/v1/articles/:id
router.delete('/:id', verifyToken, requireRole('EDITOR'), async (_req, res: Response) => {
  await prisma.article.delete({ where: { id: _req.params.id } });
  await invalidateCache('articles:featured', `articles:list:all:none:1`);
  res.json({ message: 'Article deleted' });
});

export default router;
