import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { paginate } from '../utils/helpers';

const router = Router();

// GET /api/v1/search?q=&sport=&page=
router.get('/', async (req: Request, res: Response) => {
  const { q = '', sport, page = '1' } = req.query as Record<string, string>;
  if (!q.trim()) return res.json({ articles: [], total: 0 });

  const { take, skip } = paginate(parseInt(page), 12);
  const sportFilter = sport ? `AND s.slug = '${sport.replace(/'/g, "''")}'` : '';

  // Use Prisma raw query for pg_trgm full-text search
  const articles: any[] = await prisma.$queryRaw`
    SELECT a.id, a.title, a.slug, a.excerpt, a."coverImageUrl", a."publishedAt",
           u.name as "authorName", s.name as "sportName", s.slug as "sportSlug"
    FROM "Article" a
    JOIN "User" u ON u.id = a."authorId"
    JOIN "Sport" s ON s.id = a."sportId"
    WHERE a.status = 'PUBLISHED'
      AND (
        a.title ILIKE ${'%' + q + '%'}
        OR a."bodyText" ILIKE ${'%' + q + '%'}
      )
    ORDER BY a."publishedAt" DESC
    LIMIT ${take} OFFSET ${skip}
  `;

  res.json({ articles, query: q, page: parseInt(page) });
});

export default router;
