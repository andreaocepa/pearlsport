import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';
import { getCache, setCache, invalidateCache, CACHE_TTL } from '../lib/cache';
import { startOfWeek, endOfWeek, addWeeks } from 'date-fns';

const router = Router();

const FixtureSchema = z.object({
  homeTeamId: z.string().cuid(),
  awayTeamId: z.string().cuid(),
  competitionId: z.string().cuid(),
  sportId: z.string().cuid(),
  kickoffTime: z.string().datetime(),
  venue: z.string().optional(),
  homeScore: z.number().int().optional(),
  awayScore: z.number().int().optional(),
  status: z.enum(['UPCOMING', 'LIVE', 'COMPLETED', 'POSTPONED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
});

const fixtureInclude = {
  homeTeam: { select: { id: true, name: true, slug: true, logoUrl: true } },
  awayTeam: { select: { id: true, name: true, slug: true, logoUrl: true } },
  competition: { select: { id: true, name: true, slug: true } },
  sport: { select: { id: true, name: true, slug: true } },
};

// GET /api/v1/fixtures
router.get('/', async (req: Request, res: Response) => {
  const { sport, week = 'current', status } = req.query as Record<string, string>;
  const weekOffset = week === 'next' ? 1 : week === 'prev' ? -1 : 0;
  const now = new Date();
  const weekStart = startOfWeek(addWeeks(now, weekOffset), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(addWeeks(now, weekOffset), { weekStartsOn: 1 });
  const weekId = weekStart.toISOString().split('T')[0];
  const cacheKey = `fixtures:week:${weekId}:${sport || 'all'}:${status || 'all'}`;

  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const where: any = { kickoffTime: { gte: weekStart, lte: weekEnd } };
  if (sport) where.sport = { slug: sport };
  if (status) where.status = status;

  const fixtures = await prisma.fixture.findMany({
    where,
    include: fixtureInclude,
    orderBy: { kickoffTime: 'asc' },
  });

  await setCache(cacheKey, fixtures, CACHE_TTL.FIXTURES_WEEK);
  res.json(fixtures);
});

// GET /api/v1/results
router.get('/results', async (req: Request, res: Response) => {
  const { sport, limit = '20' } = req.query as Record<string, string>;
  const where: any = { status: 'COMPLETED' };
  if (sport) where.sport = { slug: sport };

  const results = await prisma.fixture.findMany({
    where,
    include: fixtureInclude,
    orderBy: { kickoffTime: 'desc' },
    take: parseInt(limit),
  });

  res.json(results);
});

// GET /api/v1/fixtures/:id
router.get('/:id', async (req: Request, res: Response) => {
  const fixture = await prisma.fixture.findUnique({
    where: { id: req.params.id },
    include: { ...fixtureInclude, matchReport: true },
  });
  if (!fixture) return res.status(404).json({ error: 'Fixture not found' });
  res.json(fixture);
});

// POST /api/v1/fixtures
router.post('/', verifyToken, requireRole('EDITOR'), async (req: AuthRequest, res: Response) => {
  const parsed = FixtureSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const fixture = await prisma.fixture.create({
    data: { ...parsed.data, kickoffTime: new Date(parsed.data.kickoffTime) },
    include: fixtureInclude,
  });

  await invalidateCache(`fixtures:week:${new Date(parsed.data.kickoffTime).toISOString().split('T')[0]}:all:all`);
  res.status(201).json(fixture);
});

// PUT /api/v1/fixtures/:id
router.put('/:id', verifyToken, requireRole('EDITOR'), async (req: AuthRequest, res: Response) => {
  const parsed = FixtureSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data: any = { ...parsed.data };
  if (parsed.data.kickoffTime) data.kickoffTime = new Date(parsed.data.kickoffTime);

  const fixture = await prisma.fixture.update({
    where: { id: req.params.id },
    data,
    include: fixtureInclude,
  });

  await invalidateCache(`fixtures:week:all:all:all`);
  res.json(fixture);
});

// DELETE /api/v1/fixtures/:id
router.delete('/:id', verifyToken, requireRole('ADMIN'), async (_req, res: Response) => {
  await prisma.fixture.delete({ where: { id: _req.params.id } });
  res.json({ message: 'Fixture deleted' });
});

export default router;
