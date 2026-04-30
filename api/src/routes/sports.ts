import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { getCache, setCache, CACHE_TTL } from '../lib/cache';

const router = Router();

// GET /api/v1/sports
router.get('/', async (_req: Request, res: Response) => {
  const cached = await getCache('sports:all');
  if (cached) return res.json(cached);

  const sports = await prisma.sport.findMany({ orderBy: { order: 'asc' } });
  await setCache('sports:all', sports, CACHE_TTL.SPORTS);
  res.json(sports);
});

export default router;
